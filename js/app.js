(function() {
    'use strict';

    let movies = [];

    let renderMovies = function() {
        $('#listings').empty();

        for (let movie of movies) {
            let $col = $('<div>').addClass('col s6');
            let $card = $('<div>').addClass('card hoverable');
            let $content = $('<div>').addClass('card-content center');
            let $title = $('<h6>').addClass('card-title truncate');

            $title.attr({
                'data-position': 'top',
                'data-tooltip': movie.title
            });

            $title.tooltip({
                delay: 50
            }).text(movie.title);

            let $poster = $('<img>').addClass('poster');

            $poster.attr({
                src: movie.poster,
                alt: `${movie.poster} Poster`
            });

            $content.append($title, $poster);
            $card.append($content);

            let $action = $('<div>').addClass('card-action center');
            let $plot = $('<a>');

            $plot.addClass('waves-effect waves-light btn modal-trigger');
            $plot.attr('href', `#${movie.id}`);
            $plot.text('Plot Synopsis');

            $action.append($plot);
            $card.append($action);

            let $modal = $('<div>').addClass('modal').attr('id', movie.id);
            let $modalContent = $('<div>').addClass('modal-content');
            let $modalHeader = $('<h4>').text(movie.title);
            let $movieYear = $('<h6>').text(`Released in ${movie.year}`);
            let $modalText = $('<p>').text(movie.plot);

            $modalContent.append($modalHeader, $movieYear, $modalText);
            $modal.append($modalContent);

            $col.append($card, $modal);

            $('#listings').append($col);

            $('.modal-trigger').leanModal();
        }
    };

    // ADD YOUR CODE HERE
    let getMovies = function(searchTerm) {
        movies = [];

        $.ajax({
          method: 'GET',
          url: `http://www.omdbapi.com/?s=${searchTerm}`,
          datatype: 'json',


          success: function(data) {
            let results = data.Search;
            for (let result of results) {
              let movie = {
                id: result.imdbID,
                poster: result.Poster,
                title: result.Title,
                year: result.Year
              };

              getPoster(movie);
            }
          },
          error: function() {
            console.error(err);
          }
        })
      };

      let getPoster = function(movie) {
      $.ajax({
        method: 'GET',
        url: `http://www.omdbapi.com/?i=${movie.id}&plot=full`,
        datatype: 'json',

        success: function(data) {
          movie.plot = data.Plot;
          movies.push(movie);
          renderMovies();
        },
        error: function() {
          console.error(err);
        }
      })
    }

      $('form').on('submit').click(function () {
        event.preventDefault();
        let searchTerm = $('#search').val();

        if (searchTerm.trim() === '') {
          return;
        }

        getMovies(searchTerm);
      })

    })();
