(function(){
    var script = {
 "scripts": {
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "unregisterKey": function(key){  delete window[key]; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "registerKey": function(key, value){  window[key] = value; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getKey": function(key){  return window[key]; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "existsKey": function(key){  return key in window; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; }
 },
 "downloadEnabled": false,
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_6658D838_74AF_8B5A_41D7_154D466041BB,this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57,this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "rootPlayer",
 "children": [
  "this.MainViewer",
  "this.Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_22BB12F4_3075_D173_4184_EC3BC4955417",
  "this.Container_BD141CC8_9478_145B_41D4_265F47E47DB6",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_BD84EAD4_9478_3C4B_41C0_BDBA5096F748",
  "this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD",
  "this.Button_A9981BF7_B70A_5D37_41E4_8709EFEDBE47",
  "this.Button_A1BCE7AB_B33E_55DF_41D6_E8EBCCC63BBC"
 ],
 "scrollBarWidth": 10,
 "layout": "absolute",
 "width": "100%",
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "buttonToggleMute": [
  "this.IconButton_6658C838_74AF_8B5A_418E_C797984D8CAE",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D"
 ],
 "mouseWheelEnabled": true,
 "borderRadius": 0,
 "definitions": [{
 "items": [
  {
   "media": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_camera"
  },
  {
   "media": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_camera"
  },
  {
   "media": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_camera"
  },
  {
   "media": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_camera"
  },
  {
   "media": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_camera"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "touchControlMode": "drag_rotation",
 "buttonCardboardView": [
  "this.IconButton_66589837_74AF_8B56_41D7_A6F4FAC02CC3",
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB"
 ],
 "buttonToggleHotspots": [
  "this.IconButton_6658F838_74AF_8B5A_41C1_8DA59962CFF4",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96"
 ],
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonToggleGyroscope": [
  "this.IconButton_6658D838_74AF_8B5A_41D7_154D466041BB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A"
 ],
 "mouseControlMode": "drag_acceleration"
},
{
 "initialPosition": {
  "yaw": -135.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A614167A_BEBE_BB99_41E0_6A577E8B956B"
},
{
 "items": [
  {
   "media": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_camera"
  },
  {
   "media": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_camera"
  },
  {
   "media": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_camera"
  },
  {
   "media": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_camera"
  },
  {
   "media": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": 105.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A669B63B_BEBE_BB9E_41C9_19D8B1AEB2D9"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "backwardYaw": 52.07,
   "yaw": -74.64,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "backwardYaw": -81.13,
   "yaw": 44.7,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  },
  {
   "backwardYaw": -81.13,
   "yaw": 44.7,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  },
  {
   "backwardYaw": -81.13,
   "yaw": -74.64,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  }
 ],
 "thumbnailUrl": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_t.jpg",
 "id": "panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67",
 "label": "TERRAZA 3",
 "hfov": 360,
 "vfov": 180,
 "overlays": [
  "this.overlay_AB9AF613_B71E_56CE_41E2_88E558EBEAC6",
  "this.overlay_AAF1C3BD_B71E_4D3B_4189_A46FF5698B4F"
 ],
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -52.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A602D69F_BEBE_B896_41E6_9A62B5509DF2"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "backwardYaw": -74.64,
   "yaw": 52.07,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  }
 ],
 "thumbnailUrl": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_t.jpg",
 "id": "panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51",
 "label": "GIMNASIO",
 "hfov": 360,
 "vfov": 180,
 "overlays": [
  "this.overlay_AA02DC69_B71A_DB5A_41E2_4B2B47C6096B"
 ],
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 98.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A61C465A_BEBE_BB9E_41DC_8671C3A9DE8A"
},
{
 "initialPosition": {
  "yaw": -52.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A7A105D0_BEBE_B8EA_41CD_D375E45DD953"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "backwardYaw": 4.44,
   "yaw": 127.88,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575"
  },
  {
   "backwardYaw": -81.13,
   "yaw": 127.88,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  }
 ],
 "thumbnailUrl": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_t.jpg",
 "id": "panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F",
 "label": "SALA USOS MULTIPLES",
 "hfov": 360,
 "vfov": 180,
 "overlays": [
  "this.overlay_ABBF16A1_B71B_D7CA_41E5_A1A3EB68D152"
 ],
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 98.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A78735A1_BEBE_B8AA_41CD_8B665CAF0BA6"
},
{
 "items": [
  {
   "media": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_camera"
  },
  {
   "media": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_camera"
  },
  {
   "media": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_camera"
  },
  {
   "media": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_camera"
  },
  {
   "media": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist, 4, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_camera"
  }
 ],
 "id": "ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": -127.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A78D5582_BEBE_B96E_41D5_6111D92DEEE5"
},
{
 "initialPosition": {
  "yaw": -0.41,
  "class": "PanoramaCameraPosition",
  "pitch": -1.24
 },
 "automaticRotationSpeed": 0,
 "manualRotationSpeed": 600,
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_camera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_camera"
},
{
 "initialPosition": {
  "yaw": -52.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A45535D7_BEBE_B897_41D1_3C678F97384D"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "backwardYaw": 44.7,
   "yaw": -81.13,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67"
  },
  {
   "backwardYaw": -99.44,
   "yaw": 87.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AEB9A53A_BE9A_7999_41DA_18006439B575"
  },
  {
   "backwardYaw": 127.88,
   "yaw": -81.13,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "backwardYaw": 127.88,
   "yaw": 87.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  }
 ],
 "thumbnailUrl": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_t.jpg",
 "id": "panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2",
 "label": "TERRAZA 2",
 "hfov": 360,
 "vfov": 180,
 "overlays": [
  "this.overlay_AA5C6041_B71E_4B4A_41C7_ABF5052A7D82",
  "this.overlay_95181061_B719_CB4B_41B8_429DD4EAB99E"
 ],
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "thumbnailUrl": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "pitch": 0,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -92.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A66D0635_BEBE_BBAB_41D7_C8978BED190E"
},
{
 "initialPosition": {
  "yaw": -52.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A60AE699_BEBE_B89B_41D5_3F2BD9964A25"
},
{
 "hfovMax": 130,
 "adjacentPanoramas": [
  {
   "backwardYaw": 127.88,
   "yaw": 4.44,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "backwardYaw": 127.88,
   "yaw": -99.44,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F"
  },
  {
   "backwardYaw": 87.98,
   "yaw": -99.44,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2"
  }
 ],
 "thumbnailUrl": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_t.jpg",
 "id": "panorama_AEB9A53A_BE9A_7999_41DA_18006439B575",
 "label": "TERRAZA 1",
 "hfov": 360,
 "vfov": 180,
 "overlays": [
  "this.overlay_AEB9853A_BE9A_7999_41C8_F5CE334FCC45",
  "this.overlay_AEBE453B_BE9A_799F_41D1_E7EAB3182845"
 ],
 "partial": false,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "thumbnailUrl": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "tags": "ondemand",
      "height": 2048,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1
     }
    ]
   }
  }
 ],
 "pitch": 0,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -11.55,
  "class": "PanoramaCameraPosition",
  "pitch": -4.95
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_camera"
},
{
 "initialPosition": {
  "yaw": 98.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A7AED5C1_BEBE_B8EB_41E2_385839F59EC9"
},
{
 "initialPosition": {
  "yaw": 98.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A7BA95B1_BEBE_B8AA_41E5_BEA5112DC65F"
},
{
 "initialPosition": {
  "yaw": -175.56,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticRotationSpeed": 0,
 "manualRotationSpeed": 600,
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A666764B_BEBE_BBFF_41D2_BE09FD8A383F"
},
{
 "initialPosition": {
  "yaw": 80.56,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticRotationSpeed": 0,
 "manualRotationSpeed": 600,
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "camera_A60CB689_BEBE_BB7A_41D4_6F1604450FEB"
},
{
 "initialPosition": {
  "yaw": -72.99,
  "class": "PanoramaCameraPosition",
  "pitch": -4.95
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_camera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_camera"
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "MainViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "100%",
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowOpacity": 0,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBorderColor": "#000000",
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#FFFFFF",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "minHeight": 50,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#000000",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "class": "ViewerArea",
 "firstTransitionDuration": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "100%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 10,
 "toolTipBorderSize": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "minWidth": 100,
 "playbackBarHeadShadowVerticalLength": 0,
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#FFFFFF",
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 0.5,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 7,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipFontSize": 13,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipShadowColor": "#333333",
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Main Viewer"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
 "left": "0%",
 "width": 330,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "children": [
  "this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
  "this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543"
 ],
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "height": "100%",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "--- LEFT PANEL 2"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "top": "0%",
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 641,
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "-- SETTINGS"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_22BBC2F4_3075_D173_41B4_71F7A3560C34",
  "this.Container_22BBD2F4_3075_D173_41B4_8504C593E6BF",
  "this.Label_22BB22F4_3075_D173_41BB_3ACDC6CCCC83",
  "this.Label_22BB32F4_3075_D173_4191_C8B45B85DEB8"
 ],
 "id": "Container_22BB12F4_3075_D173_4184_EC3BC4955417",
 "left": 70,
 "width": 550,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "visible",
 "top": 34,
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 140,
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--STICKER"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_BD15DCC8_9478_145B_41E1_35766BBBD98F",
  "this.Container_BD147CC8_9478_145B_41E1_A1505134A3C3"
 ],
 "id": "Container_BD141CC8_9478_145B_41D4_265F47E47DB6",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_BD141CC8_9478_145B_41D4_265F47E47DB6, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--INFO photo"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--PANORAMA LIST"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--LOCATION"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--FLOORPLAN"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--PHOTOALBUM"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_BD878AD4_9478_3C4B_41E0_1542ED46C5EC",
  "this.Container_BD84CAD4_9478_3C4B_41DB_EAABF4EA300E"
 ],
 "id": "Container_BD84EAD4_9478_3C4B_41C0_BDBA5096F748",
 "left": "0%",
 "layout": "absolute",
 "backgroundOpacity": 0.6,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#04A3E1",
 "click": "this.setComponentVisibility(this.Container_BD84EAD4_9478_3C4B_41C0_BDBA5096F748, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "visible": false,
 "data": {
  "name": "--REALTOR"
 }
},
{
 "itemLabelPosition": "bottom",
 "itemLabelFontFamily": "Arial",
 "id": "ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD",
 "itemBorderRadius": 0,
 "itemVerticalAlign": "middle",
 "scrollBarWidth": 6,
 "rollOverItemLabelFontColor": "#FF9900",
 "backgroundOpacity": 0.33,
 "width": "43%",
 "horizontalAlign": "left",
 "right": "15.03%",
 "shadow": false,
 "itemPaddingLeft": 3,
 "itemOpacity": 1,
 "itemThumbnailShadowOpacity": 0.27,
 "itemThumbnailShadowSpread": 1,
 "propagateClick": false,
 "itemThumbnailOpacity": 1,
 "backgroundColor": [
  "#000000"
 ],
 "playList": "this.ThumbnailList_AE82924C_B51A_4F5A_41E5_CF599FE5D0CD_playlist",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "itemPaddingRight": 3,
 "itemBackgroundColor": [],
 "itemPaddingTop": 3,
 "minHeight": 20,
 "selectedItemLabelFontColor": "#FFFFFF",
 "borderSize": 0,
 "itemBackgroundColorRatios": [],
 "height": 120,
 "itemLabelGap": 8,
 "scrollBarVisible": "rollOver",
 "class": "ThumbnailList",
 "rollOverItemBackgroundOpacity": 0,
 "backgroundColorDirection": "vertical",
 "rollOverItemLabelFontWeight": "bold",
 "selectedItemLabelFontWeight": "normal",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "normal",
 "layout": "horizontal",
 "itemThumbnailShadowBlurRadius": 8,
 "itemLabelFontSize": 14,
 "itemThumbnailShadow": true,
 "itemThumbnailHeight": 60,
 "borderRadius": 15,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontColor": "#FFFFFF",
 "minWidth": 20,
 "rollOverItemBackgroundColorRatios": [],
 "itemBackgroundColorDirection": "vertical",
 "backgroundColorRatios": [
  0
 ],
 "bottom": "5.29%",
 "paddingLeft": 20,
 "itemHorizontalAlign": "center",
 "itemThumbnailWidth": 115,
 "itemBackgroundOpacity": 0,
 "rollOverItemBackgroundColor": [],
 "itemThumbnailShadowVerticalLength": 3,
 "itemPaddingBottom": 3,
 "itemThumbnailShadowColor": "#000000",
 "gap": 0,
 "itemThumbnailShadowHorizontalLength": 3,
 "itemLabelFontStyle": "normal",
 "paddingTop": 10,
 "rollOverItemBorderRadius": 0,
 "itemLabelHorizontalAlign": "center",
 "paddingBottom": 10,
 "itemMode": "normal",
 "rollOverItemBorderSize": 0,
 "itemThumbnailBorderRadius": 12,
 "scrollBarMargin": 2,
 "data": {
  "name": "ThumbnailList35762"
 }
},
{
 "fontFamily": "Leelawadee",
 "layout": "horizontal",
 "data": {
  "name": "Button house info"
 },
 "id": "Button_A9981BF7_B70A_5D37_41E4_8709EFEDBE47",
 "width": 130,
 "pressedBackgroundOpacity": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0.4,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "right": "0%",
 "shadow": false,
 "iconHeight": 0,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "top": "30%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "rollOverBackgroundOpacity": 0.41,
 "rollOverBackgroundColor": [
  "#FF0000"
 ],
 "rollOverFontColor": "#FFFFFF",
 "backgroundColor": [
  "#000000"
 ],
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "rollOverShadow": false,
 "mode": "push",
 "paddingRight": 0,
 "fontSize": 14,
 "label": "LOBBY",
 "minHeight": 1,
 "pressedBackgroundColor": [
  "#FF0000"
 ],
 "borderSize": 0,
 "click": "this.mainPlayList.set('selectedIndex', 3)",
 "fontStyle": "normal",
 "paddingTop": 0,
 "pressedFontColor": "#FFFFFF",
 "height": 40,
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "paddingBottom": 0,
 "iconBeforeLabel": true,
 "iconWidth": 0,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorDirection": "vertical",
 "shadowBlurRadius": 15
},
{
 "fontFamily": "Leelawadee",
 "layout": "horizontal",
 "data": {
  "name": "Button house info"
 },
 "id": "Button_A1BCE7AB_B33E_55DF_41D6_E8EBCCC63BBC",
 "width": 130,
 "pressedBackgroundOpacity": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0.4,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "right": "0%",
 "shadow": false,
 "iconHeight": 0,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "top": "40%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "rollOverBackgroundOpacity": 0.41,
 "rollOverBackgroundColor": [
  "#FF0000"
 ],
 "rollOverFontColor": "#FFFFFF",
 "backgroundColor": [
  "#000000"
 ],
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "rollOverShadow": false,
 "mode": "push",
 "paddingRight": 0,
 "fontSize": 14,
 "label": "SALA NI\u00d1OS",
 "minHeight": 1,
 "pressedBackgroundColor": [
  "#FF0000"
 ],
 "borderSize": 0,
 "click": "this.mainPlayList.set('selectedIndex', 3); this.mainPlayList.set('selectedIndex', 4)",
 "fontStyle": "normal",
 "paddingTop": 0,
 "pressedFontColor": "#FFFFFF",
 "height": 40,
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "paddingBottom": 0,
 "iconBeforeLabel": true,
 "iconWidth": 0,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorDirection": "vertical",
 "shadowBlurRadius": 15
},
{
 "id": "IconButton_6658C838_74AF_8B5A_418E_C797984D8CAE",
 "width": 30,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_6658C838_74AF_8B5A_418E_C797984D8CAE.png",
 "propagateClick": false,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 30,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_6658C838_74AF_8B5A_418E_C797984D8CAE_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton Sound"
 }
},
{
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 58,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton MUTE"
 }
},
{
 "id": "IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57",
 "width": 30,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57.png",
 "propagateClick": false,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 30,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton Fullscreen"
 }
},
{
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 58,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton FULLSCREEN"
 }
},
{
 "id": "IconButton_66589837_74AF_8B56_41D7_A6F4FAC02CC3",
 "width": 30,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_66589837_74AF_8B56_41D7_A6F4FAC02CC3.png",
 "propagateClick": false,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "height": 30,
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 }
},
{
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "height": 58,
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "visible": false,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 }
},
{
 "id": "IconButton_6658F838_74AF_8B5A_41C1_8DA59962CFF4",
 "width": 30,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_6658F838_74AF_8B5A_41C1_8DA59962CFF4.png",
 "propagateClick": false,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 30,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_6658F838_74AF_8B5A_41C1_8DA59962CFF4_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton Hs visibility"
 }
},
{
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 58,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton HS "
 }
},
{
 "id": "IconButton_6658D838_74AF_8B5A_41D7_154D466041BB",
 "width": 34,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_6658D838_74AF_8B5A_41D7_154D466041BB.png",
 "propagateClick": false,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 34,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_6658D838_74AF_8B5A_41D7_154D466041BB_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton Gyroscopic"
 }
},
{
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "height": 58,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton GYRO"
 }
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2, this.camera_A7BA95B1_BEBE_B8AA_41E5_BEA5112DC65F); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.67,
   "yaw": 44.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -6.08,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A7684E03_BE8B_CB6F_41E7_74F8EE02631C",
   "yaw": 44.7,
   "hfov": 6.67,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -6.08,
   "distance": 100
  }
 ],
 "id": "overlay_AB9AF613_B71E_56CE_41E2_88E558EBEAC6"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2, this.camera_A7AED5C1_BEBE_B8EB_41E2_385839F59EC9); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.7,
   "yaw": -74.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -3.56,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_950BB04B_B71A_4B5F_41CF_B8A971BEC9C0",
   "yaw": -74.64,
   "hfov": 6.7,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -3.56,
   "distance": 100
  }
 ],
 "id": "overlay_AAF1C3BD_B71E_4D3B_4189_A46FF5698B4F"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.7,
   "yaw": 52.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.63,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_950B204B_B71A_4B5F_41E0_FEDF32A01374",
   "yaw": 52.07,
   "hfov": 6.7,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -2.63,
   "distance": 100
  }
 ],
 "id": "overlay_AA02DC69_B71A_DB5A_41E2_4B2B47C6096B"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2, this.camera_A61C465A_BEBE_BB9E_41DC_8671C3A9DE8A); this.mainPlayList.set('selectedIndex', 2); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.7,
   "yaw": 127.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -3.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_950B004B_B71A_4B5F_41D7_F0406CF632C8",
   "yaw": 127.88,
   "hfov": 6.7,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -3.72,
   "distance": 100
  }
 ],
 "id": "overlay_ABBF16A1_B71B_D7CA_41E5_A1A3EB68D152"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F, this.camera_A60AE699_BEBE_B89B_41D5_3F2BD9964A25); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.68,
   "yaw": -81.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.98,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A76F3E03_BE8B_CB6F_41B8_318553FC7EFD",
   "yaw": -81.13,
   "hfov": 6.68,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -4.98,
   "distance": 100
  }
 ],
 "id": "overlay_AA5C6041_B71E_4B4A_41C7_ABF5052A7D82"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F, this.camera_A602D69F_BEBE_B896_41E6_9A62B5509DF2); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 7.01,
   "yaw": 87.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -5.2,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A76F5E03_BE8B_CB6F_41E6_A6E73B5989C9",
   "yaw": 87.98,
   "hfov": 7.01,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -5.2,
   "distance": 100
  }
 ],
 "id": "overlay_95181061_B719_CB4B_41B8_429DD4EAB99E"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F, this.camera_A7A105D0_BEBE_B8EA_41CD_D375E45DD953); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 7.51,
   "yaw": 4.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -2.41,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_AF8C9E9F_BE9D_C896_41B9_DA8E0EE79AB6",
   "yaw": 4.44,
   "hfov": 7.51,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -2.41,
   "distance": 100
  }
 ],
 "id": "overlay_AEB9853A_BE9A_7999_41C8_F5CE334FCC45"
},
{
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2, this.camera_A66D0635_BEBE_BBAB_41D7_C8978BED190E); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "maps": [
  {
   "hfov": 6.69,
   "yaw": -99.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0_HS_3_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ]
   },
   "pitch": -4.08,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "data": {
  "label": "Circle Generic 03"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A769DE02_BE8B_CB69_4196_C82828D90864",
   "yaw": -99.44,
   "hfov": 6.69,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -4.08,
   "distance": 100
  }
 ],
 "id": "overlay_AEBE453B_BE9A_799F_41D1_E7EAB3182845"
},
{
 "scrollBarMargin": 2,
 "id": "Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
 "left": "0%",
 "width": 66,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "children": [
  "this.Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
  "this.IconButton_7FF185EF_706F_7FC6_41A5_21B418265412"
 ],
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "overflow": "scroll",
 "top": "0%",
 "propagateClick": true,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "height": "100%",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "- COLLAPSE"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_6396DD92_74B8_852E_41C7_7F2F88EAB543",
 "left": "0%",
 "children": [
  "this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36",
  "this.IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4"
 ],
 "layout": "absolute",
 "backgroundOpacity": 0,
 "width": "100%",
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "0%",
 "propagateClick": false,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "height": "100%",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "- EXPANDED"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "overflow": "visible",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "top": "0%",
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 110,
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "button menu sup"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0,
 "width": "91.304%",
 "horizontalAlign": "center",
 "overflow": "scroll",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": true,
 "bottom": "0%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "height": "85.959%",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 3,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "-button set"
 }
},
{
 "scrollBarMargin": 2,
 "shadowSpread": 1,
 "id": "Container_22BBC2F4_3075_D173_41B4_71F7A3560C34",
 "left": "0%",
 "width": 366,
 "shadowColor": "#000000",
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": 2,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "shadowVerticalLength": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "height": 78,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "white block"
 },
 "shadowBlurRadius": 8
},
{
 "scrollBarMargin": 2,
 "shadowSpread": 1,
 "id": "Container_22BBD2F4_3075_D173_41B4_8504C593E6BF",
 "left": 0,
 "width": 366,
 "shadowColor": "#000000",
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": 86,
 "backgroundColorRatios": [
  0.01
 ],
 "propagateClick": true,
 "shadowVerticalLength": 0,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "height": 46,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "shadowHorizontalLength": 0,
 "data": {
  "name": "blue block"
 },
 "shadowBlurRadius": 7
},
{
 "fontFamily": "Oswald",
 "id": "Label_22BB22F4_3075_D173_41BB_3ACDC6CCCC83",
 "left": 10,
 "width": 391,
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadow": false,
 "borderRadius": 0,
 "text": "LOREM IPSUM",
 "minWidth": 1,
 "top": 0,
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "fontSize": 61,
 "height": 75,
 "minHeight": 1,
 "borderSize": 0,
 "fontStyle": "italic",
 "class": "Label",
 "paddingBottom": 0,
 "paddingTop": 0,
 "fontWeight": "bold",
 "textDecoration": "none",
 "fontColor": "#000000",
 "data": {
  "name": "text 1"
 }
},
{
 "fontFamily": "Oswald",
 "id": "Label_22BB32F4_3075_D173_4191_C8B45B85DEB8",
 "left": 12,
 "width": 385,
 "backgroundOpacity": 0,
 "textShadowColor": "#000000",
 "horizontalAlign": "left",
 "shadow": false,
 "textShadowOpacity": 1,
 "borderRadius": 0,
 "text": "DOLOR SIT AMET, CONSECTETUR",
 "minWidth": 1,
 "top": 90,
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "fontSize": 28,
 "height": 44,
 "minHeight": 1,
 "textShadowHorizontalLength": 0,
 "textShadowVerticalLength": 0,
 "borderSize": 0,
 "fontStyle": "italic",
 "textShadowBlurRadius": 10,
 "class": "Label",
 "paddingBottom": 0,
 "paddingTop": 0,
 "fontWeight": "normal",
 "textDecoration": "none",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "text 2"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_BD15ECC8_9478_145B_41CB_7D871BE75B47",
  "this.Container_BD158CC8_9478_145B_41B5_3F260A00D36A"
 ],
 "shadowSpread": 1,
 "id": "Container_BD15DCC8_9478_145B_41E1_35766BBBD98F",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF"
 ],
 "id": "Container_BD147CC8_9478_145B_41E1_A1505134A3C3",
 "left": "15%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "propagateClick": false,
 "bottom": "80%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "shadowSpread": 1,
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "shadowSpread": 1,
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "15%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "propagateClick": false,
 "bottom": "80%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.MapViewer",
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C"
 ],
 "shadowSpread": 1,
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "absolute",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "shadowSpread": 1,
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "vertical",
 "backgroundOpacity": 1,
 "horizontalAlign": "center",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_BD87BAD4_9478_3C4B_41D2_A8D83FD6CFF3",
  "this.Container_BD875AD4_9478_3C4B_4145_58969FE396D8"
 ],
 "shadowSpread": 1,
 "id": "Container_BD878AD4_9478_3C4B_41E0_1542ED46C5EC",
 "left": "15%",
 "shadowColor": "#000000",
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": true,
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "shadowHorizontalLength": 0,
 "shadowVerticalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadowBlurRadius": 25
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1"
 ],
 "id": "Container_BD84CAD4_9478_3C4B_41DB_EAABF4EA300E",
 "left": "15%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "scrollBarWidth": 10,
 "right": "15%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "visible",
 "top": "10%",
 "propagateClick": false,
 "bottom": "80%",
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 20,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 }
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0_HS_1_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_A7684E03_BE8B_CB6F_41E7_74F8EE02631C",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9ED5C2B_B2FE_BADF_41DB_94DD22F82C67_0_HS_2_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_950BB04B_B71A_4B5F_41CF_B8A971BEC9C0",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9D634F5_B2FE_CB4A_41C7_0F4C2EED9D51_0_HS_0_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_950B204B_B71A_4B5F_41E0_FEDF32A01374",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9DC717F_B2FE_CD37_41DF_61B84ABF854F_0_HS_1_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_950B004B_B71A_4B5F_41D7_F0406CF632C8",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0_HS_2_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_A76F3E03_BE8B_CB6F_41B8_318553FC7EFD",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_B9D89891_B2FE_DBCA_41E2_9E5929BE8DF2_0_HS_3_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_A76F5E03_BE8B_CB6F_41E6_A6E73B5989C9",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_1_HS_2_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_AF8C9E9F_BE9D_C896_41B9_DA8E0EE79AB6",
 "colCount": 4,
 "frameCount": 24
},
{
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_AEB9A53A_BE9A_7999_41DA_18006439B575_0_HS_3_0.png",
   "width": 1000,
   "height": 1500,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "id": "AnimatedImageResource_A769DE02_BE8B_CB69_4196_C82828D90864",
 "colCount": 4,
 "frameCount": 24
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
 "left": "0%",
 "width": 36,
 "layout": "absolute",
 "backgroundOpacity": 0.4,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Container black"
 }
},
{
 "id": "IconButton_7FF185EF_706F_7FC6_41A5_21B418265412",
 "left": 10,
 "width": 44,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 50,
 "borderRadius": 0,
 "minWidth": 1,
 "rollOverIconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412_rollover.png",
 "top": "40%",
 "iconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412.png",
 "propagateClick": true,
 "bottom": "40%",
 "maxHeight": 50,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, false, 0, null, null, false); this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, true, 0, null, null, false)",
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton arrow"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_7DB20382_7065_343F_4186_6E0B0B3AFF36",
 "left": "0%",
 "width": 300,
 "layout": "absolute",
 "backgroundOpacity": 0.7,
 "children": [
  "this.Image_7DB3C373_7065_34DE_41BA_CF5206137DED",
  "this.Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
  "this.Container_7DBCC382_7065_343F_41D5_9D3C36B5F479"
 ],
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "0%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "paddingRight": 40,
 "paddingLeft": 40,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 40,
 "paddingTop": 40,
 "data": {
  "name": "Container"
 }
},
{
 "id": "IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4",
 "width": 44,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "right": 9,
 "shadow": false,
 "maxWidth": 50,
 "borderRadius": 0,
 "minWidth": 1,
 "rollOverIconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4_rollover.png",
 "top": "40%",
 "iconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4.png",
 "propagateClick": true,
 "bottom": "40%",
 "maxHeight": 50,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton collapse"
 }
},
{
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 1,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "toggle",
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "height": 60,
 "minHeight": 1,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "image button menu"
 }
},
{
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "click": "this.shareTwitter(window.location.href)",
 "height": 58,
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton TWITTER"
 }
},
{
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "width": 58,
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 58,
 "borderRadius": 0,
 "minWidth": 1,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png",
 "propagateClick": true,
 "paddingRight": 0,
 "maxHeight": 58,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "click": "this.shareFacebook(window.location.href)",
 "height": 58,
 "minHeight": 1,
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton FB"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD15ECC8_9478_145B_41CB_7D871BE75B47",
 "children": [
  "this.Image_BD15FCC8_9478_145B_41DA_B306F52E3FCF"
 ],
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "width": "85%",
 "horizontalAlign": "center",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-left"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD158CC8_9478_145B_41B5_3F260A00D36A",
 "children": [
  "this.Container_BD159CC8_9478_145B_41AA_EFEDE92BF07B",
  "this.Container_BD15ACC8_9478_145B_41C2_6D37AD97A48D",
  "this.Container_BD146CC8_9478_145B_41D1_ED9BAFE44A6B"
 ],
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 1,
 "width": "50%",
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 460,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 50,
 "paddingLeft": 50,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 20,
 "paddingTop": 20,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-right"
 }
},
{
 "id": "IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF_pressed_rollover.jpg",
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF_rollover.jpg",
 "iconURL": "skin/IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF.jpg",
 "propagateClick": false,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_BD141CC8_9478_145B_41D4_265F47E47DB6, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "75%",
 "minHeight": 50,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_BD140CC8_9478_145B_41BD_F96EEC163BAF_pressed.jpg",
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": 140,
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "header"
 }
},
{
 "itemMinHeight": 50,
 "itemLabelPosition": "bottom",
 "itemLabelFontFamily": "Oswald",
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "left": 0,
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "itemBorderRadius": 0,
 "itemVerticalAlign": "top",
 "rollOverItemLabelFontColor": "#04A3E1",
 "backgroundOpacity": 0,
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "width": "100%",
 "horizontalAlign": "center",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "scrollBarWidth": 10,
 "selectedItemThumbnailShadowBlurRadius": 16,
 "shadow": false,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "itemPaddingLeft": 3,
 "itemOpacity": 1,
 "itemMinWidth": 50,
 "propagateClick": false,
 "itemThumbnailOpacity": 1,
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "paddingRight": 70,
 "itemPaddingRight": 3,
 "itemBackgroundColor": [],
 "height": "92%",
 "scrollBarColor": "#04A3E1",
 "minHeight": 1,
 "selectedItemLabelFontColor": "#04A3E1",
 "borderSize": 0,
 "itemBackgroundColorRatios": [],
 "itemPaddingTop": 3,
 "itemLabelGap": 7,
 "scrollBarVisible": "rollOver",
 "class": "ThumbnailGrid",
 "itemHeight": 160,
 "selectedItemLabelFontWeight": "bold",
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "itemLabelFontWeight": "normal",
 "itemLabelTextDecoration": "none",
 "rollOverItemThumbnailShadow": true,
 "itemLabelFontSize": 16,
 "itemThumbnailShadow": false,
 "itemThumbnailHeight": 125,
 "selectedItemThumbnailShadow": true,
 "borderRadius": 5,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontColor": "#666666",
 "minWidth": 1,
 "itemBackgroundColorDirection": "vertical",
 "bottom": -0.2,
 "paddingLeft": 70,
 "itemHorizontalAlign": "center",
 "itemThumbnailWidth": 220,
 "itemBackgroundOpacity": 0,
 "itemWidth": 220,
 "itemMaxWidth": 1000,
 "itemPaddingBottom": 3,
 "gap": 26,
 "itemLabelFontStyle": "italic",
 "paddingTop": 10,
 "itemMaxHeight": 1000,
 "itemLabelHorizontalAlign": "center",
 "paddingBottom": 70,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemMode": "normal",
 "itemThumbnailBorderRadius": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "ThumbnailList"
 }
},
{
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "width": "100%",
 "insetBorder": false,
 "backgroundOpacity": 1,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14377.55330038866!2d-73.99492968084243!3d40.75084469078082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2s400+5th+Ave%2C+New+York%2C+NY+10018!5e0!3m2!1ses!2sus!4v1467271743182",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "minHeight": 1,
 "borderSize": 0,
 "height": "100%",
 "class": "WebFrame",
 "paddingBottom": 0,
 "scrollEnabled": true,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "WebFrame48191"
 }
},
{
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "propagateClick": false,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "75%",
 "minHeight": 50,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "MapViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "100%",
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "minHeight": 1,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "class": "ViewerArea",
 "firstTransitionDuration": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "99.975%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "minWidth": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#FFFFFF",
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipFontSize": 12,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipShadowColor": "#333333",
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Floor Plan"
 }
},
{
 "children": [
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 140,
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 10,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "header"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container photo"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD87BAD4_9478_3C4B_41D2_A8D83FD6CFF3",
 "children": [
  "this.Image_BD87AAD4_9478_3C4B_41BE_0345EF6421AD"
 ],
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 1,
 "width": "55%",
 "horizontalAlign": "center",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#000000"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-left"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD875AD4_9478_3C4B_4145_58969FE396D8",
 "children": [
  "this.Container_BD874AD4_9478_3C4B_41DE_DE522887B2C7",
  "this.Container_BD877AD4_9478_3C4B_41AC_A13D39E1584C",
  "this.Container_BD84DAD4_9478_3C4B_41D9_38F6A3F8328B"
 ],
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 1,
 "width": "45%",
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 460,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 60,
 "paddingLeft": 60,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.51,
 "scrollBarColor": "#0069A3",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 20,
 "paddingTop": 20,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-right"
 }
},
{
 "id": "IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "pressedRollOverIconURL": "skin/IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1_pressed_rollover.jpg",
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1_rollover.jpg",
 "iconURL": "skin/IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1.jpg",
 "propagateClick": false,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_BD84EAD4_9478_3C4B_41C0_BDBA5096F748, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "75%",
 "minHeight": 50,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_BD84FAD4_9478_3C4B_41DD_83E1298704B1_pressed.jpg",
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "X"
 }
},
{
 "id": "Image_7DB3C373_7065_34DE_41BA_CF5206137DED",
 "left": "0.45%",
 "width": "97.727%",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadow": false,
 "maxWidth": 1095,
 "borderRadius": 0,
 "minWidth": 40,
 "url": "skin/Image_7DB3C373_7065_34DE_41BA_CF5206137DED.jpg",
 "top": "0%",
 "propagateClick": true,
 "maxHeight": 1095,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": "36.412%",
 "minHeight": 30,
 "borderSize": 0,
 "class": "Image",
 "scaleMode": "fit_inside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image Company"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
  "this.Button_7DB31382_7065_343F_41D6_641BBE1B2562",
  "this.Container_7DB30382_7065_343F_416C_8610BCBA9F50",
  "this.Button_7DB33382_7065_343F_41B1_0B0F019C1828",
  "this.Container_7DB32382_7065_343F_419E_6594814C420F",
  "this.Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
  "this.Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
  "this.Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
  "this.Container_7DBC9382_7065_343F_41CC_ED357655BB95",
  "this.Container_7DBCB382_7065_343F_41D8_AB382D384291",
  "this.Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
  "this.Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9"
 ],
 "id": "Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
 "left": "0%",
 "width": "97.273%",
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "scrollBarWidth": 10,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "overflow": "scroll",
 "top": "36.33%",
 "propagateClick": true,
 "bottom": "13.1%",
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "-Container buttons"
 }
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
  "this.Container_66588837_74AF_8B56_41CA_E204728E8E6C",
  "this.HTMLText_7DB2E382_7065_343F_41C2_951F708170F1"
 ],
 "id": "Container_7DBCC382_7065_343F_41D5_9D3C36B5F479",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "right": "0%",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": true,
 "bottom": "0%",
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "bottom",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 120,
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "-Container footer"
 }
},
{
 "id": "Image_BD15FCC8_9478_145B_41DA_B306F52E3FCF",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 2000,
 "borderRadius": 0,
 "minWidth": 1,
 "url": "skin/Image_BD15FCC8_9478_145B_41DA_B306F52E3FCF.jpg",
 "top": "0%",
 "propagateClick": false,
 "maxHeight": 1000,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": "100%",
 "minHeight": 1,
 "borderSize": 0,
 "class": "Image",
 "scaleMode": "fit_outside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_BD159CC8_9478_145B_41AA_EFEDE92BF07B",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "right",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "height": 50,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 0,
 "contentOpaque": false,
 "gap": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 20,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD15ACC8_9478_145B_41C2_6D37AD97A48D",
 "children": [
  "this.HTMLText_BD15BCC8_9478_145B_41A0_1BDCC9E92EE8",
  "this.Button_BD145CC8_9478_145B_41D6_359CB4C54BCA"
 ],
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 300,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 10,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container text"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_BD146CC8_9478_145B_41D1_ED9BAFE44A6B",
 "width": 370,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": 30,
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Container space"
 }
},
{
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "right": 20,
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "top": 20,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "propagateClick": false,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "36.14%",
 "minHeight": 50,
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "right": 20,
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "top": 20,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "propagateClick": false,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "36.14%",
 "minHeight": 50,
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "width": "100%",
 "playbackBarProgressBorderSize": 0,
 "toolTipShadowOpacity": 1,
 "shadow": false,
 "playbackBarBorderRadius": 0,
 "toolTipFontStyle": "normal",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "minHeight": 1,
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressOpacity": 1,
 "transitionDuration": 500,
 "class": "ViewerArea",
 "firstTransitionDuration": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "height": "100%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "progressBarOpacity": 1,
 "toolTipDisplayTime": 600,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "minWidth": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "top": "0%",
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "paddingLeft": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#0066FF",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "progressBorderColor": "#FFFFFF",
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "progressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipFontSize": 12,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipShadowColor": "#333333",
 "paddingBottom": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Viewer photoalbum 1"
 }
},
{
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "width": "14.22%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "top": "20%",
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "propagateClick": true,
 "bottom": "20%",
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "minHeight": 50,
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton <"
 }
},
{
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "width": "14.22%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "right": 10,
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "top": "20%",
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "propagateClick": true,
 "bottom": "20%",
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "minHeight": 50,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton >"
 }
},
{
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "width": "10%",
 "backgroundOpacity": 0,
 "horizontalAlign": "right",
 "right": 20,
 "shadow": false,
 "maxWidth": 60,
 "borderRadius": 0,
 "minWidth": 50,
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "top": 20,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "propagateClick": true,
 "maxHeight": 60,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "mode": "push",
 "paddingRight": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "height": "10%",
 "minHeight": 50,
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "borderSize": 0,
 "class": "IconButton",
 "paddingBottom": 0,
 "paddingTop": 0,
 "cursor": "hand",
 "transparencyActive": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "id": "Image_BD87AAD4_9478_3C4B_41BE_0345EF6421AD",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "shadow": false,
 "maxWidth": 2000,
 "borderRadius": 0,
 "minWidth": 1,
 "url": "skin/Image_BD87AAD4_9478_3C4B_41BE_0345EF6421AD.jpg",
 "top": "0%",
 "propagateClick": false,
 "maxHeight": 1000,
 "paddingLeft": 0,
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "height": "100%",
 "minHeight": 1,
 "borderSize": 0,
 "class": "Image",
 "scaleMode": "fit_outside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Image40635"
 }
},
{
 "scrollBarMargin": 2,
 "height": "5%",
 "id": "Container_BD874AD4_9478_3C4B_41DE_DE522887B2C7",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "right",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 0,
 "contentOpaque": false,
 "gap": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 20,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "height": "100%",
 "id": "Container_BD877AD4_9478_3C4B_41AC_A13D39E1584C",
 "children": [
  "this.HTMLText_BD876AD4_9478_3C4B_41D6_3C886AE845B6",
  "this.Container_BD870AD4_9478_3C4B_41D4_7C5B5C74D90A"
 ],
 "scrollBarWidth": 10,
 "layout": "vertical",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 100,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.79,
 "scrollBarColor": "#E73B2C",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 520,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 30,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container text"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_BD84DAD4_9478_3C4B_41D9_38F6A3F8328B",
 "width": 370,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": 40,
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "Container space"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_7DB31382_7065_343F_41D6_641BBE1B2562",
 "width": "100%",
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Oswald",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingRight": 0,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 18,
 "label": "UBICACI\u00d3N",
 "height": 50,
 "minHeight": 1,
 "borderSize": 0,
 "click": "this.setComponentVisibility(this.Container_BD141CC8_9478_145B_41D4_265F47E47DB6, true, 0, null, null, false); this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false)",
 "fontStyle": "italic",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Tour Info"
 },
 "shadowBlurRadius": 6
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DB30382_7065_343F_416C_8610BCBA9F50",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_7DB33382_7065_343F_41B1_0B0F019C1828",
 "width": "100%",
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Oswald",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingRight": 0,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 18,
 "label": "RESE\u00d1A",
 "height": 50,
 "minHeight": 1,
 "borderSize": 0,
 "click": "this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false); this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "fontStyle": "italic",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 23,
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Panorama List"
 },
 "shadowBlurRadius": 6
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DB32382_7065_343F_419E_6594814C420F",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
 "width": "100%",
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Oswald",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "pressedLabel": "Location",
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingRight": 0,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 18,
 "label": "UBICACI\u00d3N",
 "height": 50,
 "minHeight": 1,
 "borderSize": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false); this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, false, 0, null, null, false)",
 "fontStyle": "italic",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Location"
 },
 "shadowBlurRadius": 6
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
 "width": "100%",
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Oswald",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingRight": 0,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 18,
 "label": "CONTACTO",
 "height": 50,
 "minHeight": 1,
 "borderSize": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false); this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false)",
 "fontStyle": "italic",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Floorplan"
 },
 "shadowBlurRadius": 6
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DBC9382_7065_343F_41CC_ED357655BB95",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DBCB382_7065_343F_41D8_AB382D384291",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "iconWidth": 32,
 "layout": "horizontal",
 "id": "Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
 "width": "100%",
 "pressedBackgroundOpacity": 1,
 "fontFamily": "Oswald",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 0,
 "borderColor": "#000000",
 "minWidth": 1,
 "rollOverBackgroundOpacity": 0.8,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingRight": 0,
 "paddingLeft": 10,
 "verticalAlign": "middle",
 "mode": "push",
 "fontSize": 18,
 "label": "INFORMES",
 "height": 50,
 "minHeight": 1,
 "borderSize": 0,
 "click": "this.setComponentVisibility(this.Container_BD84EAD4_9478_3C4B_41C0_BDBA5096F748, true, 0, null, null, false); this.setComponentVisibility(this.Container_6396DD92_74B8_852E_41C7_7F2F88EAB543, false, 0, null, null, false)",
 "fontStyle": "italic",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Contact"
 },
 "shadowBlurRadius": 6
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "backgroundOpacity": 0.3,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "height": 1,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 }
},
{
 "scrollBarMargin": 2,
 "id": "Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
 "width": 40,
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 1,
 "horizontalAlign": "left",
 "overflow": "visible",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "paddingRight": 0,
 "scrollBarColor": "#000000",
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "height": 2,
 "backgroundColorDirection": "vertical",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "blue line"
 }
},
{
 "children": [
  "this.IconButton_66589837_74AF_8B56_41D7_A6F4FAC02CC3",
  "this.IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57",
  "this.IconButton_6658F838_74AF_8B5A_41C1_8DA59962CFF4",
  "this.IconButton_6658C838_74AF_8B5A_418E_C797984D8CAE",
  "this.IconButton_6658D838_74AF_8B5A_41D7_154D466041BB"
 ],
 "id": "Container_66588837_74AF_8B56_41CA_E204728E8E6C",
 "width": "100%",
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 40,
 "minHeight": 1,
 "contentOpaque": false,
 "borderSize": 0,
 "gap": 16,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "-Container settings"
 }
},
{
 "id": "HTMLText_7DB2E382_7065_343F_41C2_951F708170F1",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": true,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "height": 78,
 "minHeight": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Company Name</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>info@loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV></div>",
 "paddingBottom": 0,
 "paddingTop": 0,
 "visible": false,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText47602"
 }
},
{
 "id": "HTMLText_BD15BCC8_9478_145B_41A0_1BDCC9E92EE8",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": false,
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "paddingRight": 10,
 "scrollBarColor": "#04A3E1",
 "height": "100%",
 "minHeight": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.4vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.98vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.98vh;font-family:'Oswald';\"><B><I>DOLOR SIT AME</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.49vh;font-family:'Oswald';\"><B>CONSECTETUR ADIPISCING ELIT. MORBI BIBENDUM PHARETRA LOREM, ACCUMSAN SAN NULLA.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.09vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.09vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV><p STYLE=\"margin:0; line-height:1.09vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.49vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.49vh;font-family:'Oswald';\"><B><I>DONEC FEUGIAT:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.56vh;\"> </SPAN>\u2022 Nisl nec mi sollicitudin facilisis </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Nam sed faucibus est.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Ut eget lorem sed leo.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.49vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.49vh;font-family:'Oswald';\"><B><I>LOREM IPSUM:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.8vh;font-family:'Oswald';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 20,
 "paddingTop": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText"
 }
},
{
 "fontFamily": "Oswald",
 "layout": "horizontal",
 "id": "Button_BD145CC8_9478_145B_41D6_359CB4C54BCA",
 "width": 180,
 "pressedBackgroundOpacity": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundOpacity": 0.7,
 "horizontalAlign": "center",
 "shadowColor": "#000000",
 "shadowSpread": 1,
 "shadow": false,
 "iconHeight": 32,
 "borderRadius": 50,
 "borderColor": "#000000",
 "minWidth": 1,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "rollOverBackgroundOpacity": 1,
 "backgroundColor": [
  "#04A3E1"
 ],
 "paddingLeft": 0,
 "verticalAlign": "middle",
 "mode": "push",
 "paddingRight": 0,
 "fontSize": "2.39vh",
 "label": "LOREM IPSUM",
 "minHeight": 1,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "fontStyle": "italic",
 "borderSize": 0,
 "height": 50,
 "gap": 5,
 "backgroundColorDirection": "vertical",
 "class": "Button",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconBeforeLabel": true,
 "iconWidth": 32,
 "fontWeight": "bold",
 "textDecoration": "none",
 "cursor": "hand",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button31015"
 },
 "shadowBlurRadius": 6
},
{
 "id": "HTMLText_BD876AD4_9478_3C4B_41D6_3C886AE845B6",
 "width": "100%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarOpacity": 0,
 "paddingRight": 0,
 "scrollBarColor": "#04A3E1",
 "height": "46%",
 "minHeight": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.4vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.98vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.98vh;font-family:'Oswald';\"><B><I>DOLOR SIT AMET</I></B></SPAN></SPAN></DIV></div>",
 "paddingBottom": 10,
 "paddingTop": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText18899"
 }
},
{
 "scrollBarMargin": 2,
 "height": "75%",
 "id": "Container_BD870AD4_9478_3C4B_41D4_7C5B5C74D90A",
 "children": [
  "this.Image_BD873AD4_9478_3C4B_41E1_8CD5E779D6D2",
  "this.HTMLText_BD872AD4_9478_3C4B_41E0_004DEE953DF2"
 ],
 "scrollBarWidth": 10,
 "layout": "horizontal",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "paddingRight": 0,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minHeight": 1,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Container",
 "paddingBottom": 0,
 "paddingTop": 0,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "- content"
 }
},
{
 "id": "Image_BD873AD4_9478_3C4B_41E1_8CD5E779D6D2",
 "width": "25%",
 "backgroundOpacity": 0,
 "horizontalAlign": "left",
 "shadow": false,
 "maxWidth": 200,
 "borderRadius": 0,
 "minWidth": 1,
 "url": "skin/Image_BD873AD4_9478_3C4B_41E1_8CD5E779D6D2.jpg",
 "propagateClick": false,
 "maxHeight": 200,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": "100%",
 "minHeight": 1,
 "borderSize": 0,
 "class": "Image",
 "scaleMode": "fit_inside",
 "paddingBottom": 0,
 "paddingTop": 0,
 "data": {
  "name": "agent photo"
 }
},
{
 "id": "HTMLText_BD872AD4_9478_3C4B_41E0_004DEE953DF2",
 "width": "75%",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "shadow": false,
 "borderRadius": 0,
 "minWidth": 1,
 "propagateClick": false,
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "paddingRight": 10,
 "scrollBarColor": "#04A3E1",
 "height": "100%",
 "minHeight": 1,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.49vh;font-family:'Oswald';\"><B><I>JOHN DOE</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.49vh;font-family:'Oswald';\"><I>Licensed Real Estate Salesperson</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.87vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.87vh;font-family:'Oswald';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.87vh;font-family:'Oswald';\"><I>jhondoe@realestate.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.87vh;font-family:'Oswald';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.09vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.09vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV></div>",
 "paddingBottom": 10,
 "paddingTop": 0,
 "scrollBarMargin": 2,
 "data": {
  "name": "HTMLText19460"
 }
}],
 "backgroundPreloadEnabled": true,
 "minWidth": 20,
 "desktopMipmappingEnabled": false,
 "mobileMipmappingEnabled": false,
 "propagateClick": true,
 "paddingRight": 0,
 "vrPolyfillScale": 0.5,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "minHeight": 20,
 "contentOpaque": false,
 "gap": 10,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "class": "Player",
 "buttonToggleFullscreen": [
  "this.IconButton_6658E837_74AF_8B56_41B5_2A29A6498E57",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0"
 ],
 "paddingBottom": 0,
 "paddingTop": 0,
 "defaultVRPointer": "laser",
 "data": {
  "name": "Player468"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
