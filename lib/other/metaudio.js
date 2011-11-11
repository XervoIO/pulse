/**
* @file
* @brief    metaudio recording management for Joomla
* @author   Levente Hunyadi
* @version  $__VERSION__$
* @remarks  Copyright (C) 2010 Levente Hunyadi
* @remarks  Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
* @see      http://hunyadi.info.hu/projects/metaudio
*/

// Developed with: jQuery 1.4
// Status: stable

//
// Flash interface
//
metaudio = {
	init: function (url) {
		swfobject.embedSWF(
			url,
			'metaudio-placeholder',
			'1', '1',
			'10.1',
			false,
			{},
			{
				menu: false,
				scale: 'noScale',
				allowScriptAccess: 'always'
			},
			{
				id: 'metaudio-player',   // added for IE compatibility
				name: 'metaudio-player'  // added for IE compatibility
			},
			function (flashevent) {
				if (flashevent.ref) {
					metaudio = {  // metaudio global object
						/**
						* HTML DOM object of the Flash player.
						*/
						player: flashevent.ref,
						/**
						* Sounds collection.
						*/
						sounds: {},
						/**
						* Creates a new sound instance and adds it to the sounds collection.
						*/
						create: function (attrs) {
							var player = this.player;
							var noop = function () { };

							// create new sound instance
							player.mpCreate(attrs.url);

							var sound = {
								url: attrs.url,
								loading: true,
								playing: false,
								play: function () {
									player.mpPlay(this.url);
								},
								stop: function () {
									player.mpStop(this.url);
								},
								resume: function () {
									player.mpResume(this.url);
								},
								pause: function () {
									player.mpPause(this.url);
								},
								getBytesTotal: function () {
									return player.mpGetBytesTotal(this.url);
								},
								getBytesLoaded: function () {
									return player.mpGetBytesLoaded(this.url);
								},
								getDuration: function () {
									return player.mpGetDuration(this.url);
								},
								getPosition: function () {
									return player.mpGetPosition(this.url);
								},
								setPosition: function (milliseconds) {
									player.mpSetPosition(this.url, milliseconds);
								}
							};
							var soundevents = {
								onload: noop,
								onplay: noop,
								onstop: noop,
								onresume: noop,
								onpause: noop,
								onfinish: noop,
								onseek: noop,
								whileplaying: noop,
								whileloading: noop
							};
							for (var evt in soundevents) {
								sound[evt] = attrs[evt] ? attrs[evt] : soundevents[evt];
							}

							// add sound to collection
							this.sounds[attrs.url] = sound;

							return sound;
						},
						/**
						* Pauses playing all sounds except the one specified.
						*/
						pauseAllBut: function (url) {
							for (var soundurl in this.sounds) {
								if (soundurl != url) {
									this.sounds[soundurl].pause();
								}
							}
						},
						/**
						* Fired when a sound has loaded sufficient data to begin playing.
						*/
						onload: function (url) {
							var sound = this.sounds[url];
							sound.onload();
						},
						/**
						* Fired when a sound starts playing.
						*/
						onplay: function (url) {
							var sound = this.sounds[url];
							sound.playing = true;
							sound.onplay();
						},
						/**
						* Fired when a sound stops playing.
						*/
						onstop: function (url) {
							var sound = this.sounds[url];
							sound.playing = false;
							sound.onstop();
						},
						/**
						* Fired when a sound that has been paused resumes playing.
						*/
						onresume: function (url) {
							var sound = this.sounds[url];
							sound.playing = true;
							sound.onresume();
						},
						/**
						* Fired when a sound that has started playing is paused.
						*/
						onpause: function (url) {
							var sound = this.sounds[url];
							sound.playing = false;
							sound.onpause();
						},
						/**
						* Fired when a sound completes playing.
						*/
						onfinish: function (url) {
							var sound = this.sounds[url];
							sound.playing = false;
							sound.onfinish();
						},
						/**
						* Fired when a new playhead position is set.
						* @param pos The new position set.
						*/
						onseek: function (url, pos) {
							this.sounds[url].onseek(pos);
						},
						/**
						* Retrieves peak volume data.
						*/
						getPeak: function () {
							return this.player.mpGetPeak();
						},
						/**
						* Retrieves waveform data.
						*/
						getWaveform: function () {
							return this.player.mpGetWaveform();
						},
						savePeak: function () {
							this.peakData = this.getPeak();
						},
						saveWaveform: function () {
							this.waveformData = this.getWaveform();
						},
						/**
						* Automatically called periodically to help update visual user interface.
						*/
						poll: function () {
							var sounds = this.sounds;
							for (var soundurl in sounds) {
								var sound = sounds[soundurl];
								if (sound.playing) {
									sound.whileplaying();
								}
								if (sound.loading) {
									sound.whileloading();
									var bytesTotal = sound.getBytesTotal();
									var bytesLoaded = sound.getBytesLoaded();
									if (bytesTotal > 0 && bytesLoaded >= bytesTotal) {
										sound.loading = false;
									}
								}
							}
						}
					};
					this.interval = setInterval(function () {
						metaudio.poll();  // ensure proper reference to "this"
					}, 100);
				}
			}
		);
	}
};

jQuery(function ($) {
	//
	// Graphical user interface
	//

	/**
	* Converts a millisecond value to a time format "hh:mm".
	*/
	function _getTime(milliseconds) {
		var minutes = Math.floor(milliseconds / (60 * 1000));
		var seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
		return minutes + ':' + ('0' + seconds).slice(-2);
	}

	/**
	* Updates recording total time and the loaded progress indicator.
	* @param sound A sound object.
	*/
	function _updateStatusLoaded(parent, sound) {
		var bytesTotal = sound ? sound.getBytesTotal() : 0;
		var rLoaded = bytesTotal ? sound.getBytesLoaded() / bytesTotal : 0;
		var duration = sound ? sound.getDuration() : 0;

		$('.metaudio-loading', parent).css({
			width: (100 * rLoaded) + '%'
		});
		$('.metaudio-total', parent).text(duration ? _getTime(duration) : '-:--');
	}

	/**
	* Updates recording current time and the position progress inditcator.
	* @param sound A sound object.
	* @param pos Playhead position [ms]. May differ from position retrieved from sound when seeking.
	*/
	function _updateStatusPosition(parent, sound, pos) {
		var bytesTotal = sound ? sound.getBytesTotal() : 0;
		var rLoaded = bytesTotal ? sound.getBytesLoaded() / bytesTotal : 0;
		var duration = sound ? sound.getDuration() : 0;
		var rPlayed = pos && duration ? pos / duration : 0;

		$('.metaudio-position', parent).css({
			width: (100 * rPlayed * rLoaded) + '%'
		});
		$('.metaudio-current', parent).text(pos ? _getTime(pos) : '-:--');
	}

	/**
	* Draws a waveform as a connected line series.
	* @param ctx A canvas context to use in drawing the waveform.
	* @param data 256 floating point values in the range [-1;1].
	*/
	function _drawWaveform(ctx, data) {
		if (data.length > 0) {
			//var w = ctx.canvas.width;  // incorrect results in explorercanvas
			var w = $(ctx.canvas).width();
			//var h = ctx.canvas.height;
			var h = $(ctx.canvas).height();

			ctx.beginPath();
			ctx.moveTo(0,(h*data[0]+h)/2);
			for (var index = 1; index < 256; index++) {
				ctx.lineTo(index*w/256,(h*data[index]+h)/2);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
	
	/**
	* Draws a spectrogram visualizing waveform data.
	*/
	function _drawSpectrogram(ctx) {
		var c = ctx.canvas;

		// clear spectrogram
		ctx.clearRect(0,0,c.width,c.height);

		// show waveform
		var waveformdata = metaudio.waveformData;
		if (waveformdata) {  // waveform data available
			ctx.save();

			var swapchannels = $(c).parent().hasClass('metaudio-swap');
			
			// draw waveform for left channel
			ctx.lineWidth = '1';
			ctx.strokeStyle = '#9cf';
			_drawWaveform(ctx, swapchannels ? waveformdata.right : waveformdata.left);

			// draw waveform for right channel
			ctx.strokeStyle = '#000';
			_drawWaveform(ctx, swapchannels ? waveformdata.left : waveformdata.right);

			ctx.restore();
		}
	}

	/**
	* The 2D context for drawing a waveform.
	*/
	function _getCanvasContext(elem) {
		var canvas = $('canvas:first', elem);
		return canvas.size() && canvas[0].getContext ? canvas[0].getContext('2d') : null;
	}

	var tooltip = $('<div class="metaudio-tooltip" />').appendTo('body');
	var anchors = $('a.metaudio-player');

	// add interface for each sound
	anchors.after(
		'<div class="metaudio-timing"><span class="metaudio-current">-:--</span> / <span class="metaudio-total">-:--</span></div>' +
		'<div class="metaudio-peak"><div><div class="metaudio-left" /><div class="metaudio-right" /></div></div>' +
		'<div class="metaudio-spectrogram" />' +
		'<div class="metaudio-statusbar">' +
			'<div class="metaudio-loading" />' +
			'<div class="metaudio-position" />' +
		'</div>'
	);

	// initialize portable canvas support
	$('.metaudio-spectrogram').each(function () {
		var canvasDOM = document.createElement('canvas');
		canvasDOM.width = 256;
		canvasDOM.height = 20;
		var manager = window.G_vmlCanvasManager;
		if (manager) {
			manager.initElement(canvasDOM);
		}
		$(this).append(canvasDOM);
	}).click(function () {
		$(this).toggleClass('metaudio-swap');  // swap left and right channel in spectrogram upon mouse click
		var ctx = _getCanvasContext(this);
		if (ctx) {
			_drawSpectrogram(ctx);
			return false;  // do not propagate click event if spectrogram channels are swapped
		}
	});

	function _getSound(statusbarDOM) {
		return metaudio.sounds[$(statusbarDOM).siblings('a:first').attr('href')];
	}
	
	function _getPlayheadPosition(statusbarDOM, event) {
		var statusbar = $(statusbarDOM);
		var r = (event.pageX - statusbar.offset().left) / statusbar.width();
		var sound = _getSound(statusbarDOM);
		if (sound) {
			var duration = sound.getDuration();
			var bytesTotal = sound.getBytesTotal();
			if (duration && bytesTotal) {
				return Math.floor(r * duration * sound.getBytesLoaded() / bytesTotal);
			}
		}
		return 0;
	}
	
	// add status bar that displays playhead position and load progress
	$('.metaudio-statusbar', anchors.parent()).click(function (event) {
		var pos = _getPlayheadPosition(this, event);
		var sound = _getSound(this);
		if (sound) {
			sound.setPosition(pos);
		}
		return false;
	}).mousemove(function (event) {
		var self = $(this);
		tooltip.offset({
			left: event.pageX + 20,
			top: self.offset().top + self.height() + 10
		}).text(_getTime(_getPlayheadPosition(this, event))).show();
	}).mouseout(function () {
		tooltip.hide().empty();
	});

	// suppress default anchor behavior
	var listitems = anchors.closest('li');
	listitems.find('a').not(anchors).click(function (event) {
		event.stopPropagation();  // prevent clicks on links in description pausing/resuming sound playback
	});
	anchors.click(function (event) {
		event.preventDefault();  // prevent clicks on sound links taking user away from page
	});

	// bind user actions to sound actions and sound events to user interface changes
	_updateStatusLoaded(listitems);
	_updateStatusPosition(listitems);
	listitems.click(function () {
		var listitem = $(this);
		var anchor = $('a:first', listitem);
		var url = anchor.attr('href');
		var ctx = _getCanvasContext(listitem);

		// stop playing all recordings except the one activated
		metaudio.pauseAllBut(url);
		listitems.not(listitem).removeClass('sm2_active');

		var sound = metaudio.sounds[url];
		if (!sound) {
			sound = metaudio.create({
				url: url,
				usePeakData: true,
				useWaveformData: !!ctx,
				onload: function () {
					_updateStatusLoaded(listitem, this);
				},
				onplay: function () {
					listitem.addClass('sm2_playing');
				},
				onstop: function () {
					listitem.removeClass('sm2_playing sm2_paused');
				},
				onpause: function () {
					listitem.removeClass('sm2_playing');
					listitem.addClass('sm2_paused');
				},
				onresume: function () {
					listitem.removeClass('sm2_paused');
					listitem.addClass('sm2_playing');
				},
				onfinish: function () {
					listitem.removeClass('sm2_playing sm2_paused');
					_updateStatusPosition(listitem);
				},
				onseek: function (pos) {
					_updateStatusPosition(listitem, this, pos);
				},
				whileloading: function () {
					_updateStatusLoaded(listitem, this);
				},
				whileplaying: function () {
					_updateStatusPosition(listitem, this, this.getPosition());

					// show volume peaks
					metaudio.savePeak();
					var peakdata = metaudio.peakData;
					var peakbars = $('.metaudio-peak', listitem);
					if (peakdata) {
						$('.metaudio-left', peakbars).css('height', (100*peakdata.left)+'%');
						$('.metaudio-right', peakbars).css('height', (100*peakdata.right)+'%');
					} else {
						peakbars.children().css('height', 0);
					}

					if (ctx) {
						metaudio.saveWaveform();
						_drawSpectrogram(ctx);
					}
				}
			});
		}

		if (listitem.hasClass('sm2_active')) {  // recording selected
			if (listitem.hasClass('sm2_paused')) {  // sound playing or paused
				sound.resume();
			} else if (listitem.hasClass('sm2_playing')) {
				sound.pause();
			} else {  // sound not yet loaded or stopped
				sound.play();
			}
		}
		listitem.addClass('sm2_active');
	});
});

if (document.all) {
	/**
	* Address a Flash unloading bug in IE.
	*/
	function _removeSoundPlayer() {
		var el = document.all['metaudio-player'];
		if (el) {
			el.removeNode(true);
		}
	}

	if (window.addEventListener) {
		window.addEventListener('unload', _removeSoundPlayer, false);
	} else if (window.attachEvent) {
		window.attachEvent('onunload', _removeSoundPlayer);
	} else {
		window.unload = _removeSoundPlayer;
	}
}
