$('#song_btn').on('click', function(event) {

    event.preventDefault();

    var song = $('#song_input').val();
    var request = $.get('https://api.spotify.com/v1/search?q=' + song + '&type=track');

    $('.more_resultsdiv').empty();
    $('.more_resultsdiv').css({"border-width": "0px"});

    request.done(dataSongs);
    request.fail(handleError);
});

function handleError() {
    console.error('¡¡ Ha Fallado !!');
}

function dataSongs(song) {
    var track = song.tracks.items[0];
    var cover = '<img src="' + track.album.images[0].url + '">';
    var audio = '<audio class="js-player" src="' + track.preview_url + '">';
    var more_results = '<br/><button type="submit" class="btn btn-success" id="more_btn">Ver más Resultados</button>';

    $('.song_title').text(track.name);
    $('.artist_name').text(track.artists[0].name);
    $('.cover_image').html(cover);
    $('.audio').html(audio);
    $('.more_result').html(more_results);
};

$(document).on('click', '#more_btn', function() {

    $('.more_resultsdiv').empty();

    var baseUrl = 'https://api.spotify.com/v1/'
    var query = $('#song_input').val();
    var spotify_json = $.get(baseUrl + 'search?type=track&query=' + query, function(data) {
        for (i = 0; i < 10; i++) {
            $('.more_resultsdiv').css({
                "border-color": "#b2d500",
                "border-width": "4px",
                "border-style": "solid"
            })
            $('.more_resultsdiv').append('<a href="#" id="' + data.tracks.items[i].name + '" class="enlace">' + data.tracks.items[i].name + '</a>');
        }
    })
})

$(document).on('click', '.enlace', function() {
	
    var moreTrack = $(this).attr("id");
    var request = $.get('https://api.spotify.com/v1/search?q=' + moreTrack + '&type=track');

    request.done(dataSongs);
    request.fail(handleError);

});


function printTime() {

    var current = $('.js-player').prop('currentTime');
    $('#Progress_Song').val(current);

}

$('.btn-play').on('click', function play() {

    if ($('.btn-play').hasClass('disabled')) {
        $('.js-player').trigger('play');
        togglePlay();
    } else {
        $('.js-player').trigger('pause');
        togglePlay();
    }

    $('.js-player').on('timeupdate', printTime);

});

function togglePlay() {
    $('.btn-play').toggleClass('playing');
    $('.btn-play').toggleClass('disabled');
}

$('.artist_name').on('click', function Info_Artist(event) {

    event.preventDefault();

    var artist = $('.artist_name').text();
    var request = $.get('https://api.spotify.com/v1/search?q=' + artist + '&type=artist');

    function Data_Artist(artist) {

        var info = artist.artists.items[0];
        var image_artist = '<img class="image_artist" src="' + info.images[0].url + '">';
        var genres_artist = '<p class="info">Género Musical:</p><p class="data_info">' + info.genres + '</p><br/>'
        var followers_artist = '<p class="info">Seguidores:</p><p class="data_info">' + info.followers.total + '</p><br/>'
        var popularity_artist = '<p class="info">Popularidad:</p><p class="data_info">' + info.popularity + '</p><br/>'
        var not_available = $(".data_info");

        $('#myModalLabel').text(info.name);
        $('.modal-body').html(image_artist);
        $('.modal-body').append(genres_artist);
        $('.modal-body').append(followers_artist);
        $('.modal-body').append(popularity_artist);

        if (not_available.text() === '') {
            not_available.text("No Disponible");
        }
    };

    function handle_Error() {
        console.error('¡¡ Ha Fallado !!');
    }

    request.done(Data_Artist);
    request.fail(handle_Error);
    $("#myModal").modal('show');
});