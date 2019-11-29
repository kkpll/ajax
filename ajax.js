//セミナー情報よみこみ

var Seminar = (function(){

    var seminar_url;
    var total_page;
    var seminar_cat;
    var current_page   = 1;
    var display_length = 10;
    var future         = true;

    function init( args ){

        seminar_url    = args.seminar_url;
        seminar_cat    = args.seminar_cat;
        is_future      = args.is_future;

        getSeminarPosts();

    }

    function getSeminarPosts(){

        var params = [
            "seminar_url=" + seminar_url,
            "seminar_cat=" + seminar_cat,
            "current_page=" + current_page,
        ]

        var req = new XMLHttpRequest();

        req.onreadystatechange = function(){

            if( req.readyState === 4 ){

                var data = JSON.parse(req.responseText);

                total_page = !total_page ? data[0]['total_page'] : total_page ;

                if( Seminar.appendSeminarPosts ) Seminar.appendSeminarPosts( data );

                if( total_page > current_page ){
                    current_page ++;
                    getSeminarPosts();
                }

            }

        };

        req.open( 'POST','ajax.php', true );
        req.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        req.send( params.join('&') );

    }

    function appendSeminarPosts(data){}

    return {
        init        : init,
        appendPosts : appendSeminarPosts,
    }


})();
