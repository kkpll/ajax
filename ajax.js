//セミナー情報よみこみ


function Seminar(url,params){

    this.baseUrl     = url + '/wp-json/wp/v2';
    this.postUrl     = this.baseUrl + '/seminar/';
    this.mediaUrl    = this.baseUrl + '/media/';
    this.catUrl      = this.baseUrl + '/seminar_cat/';
    this.params      = params;
    this.currentPage = 1;
    this.totalPages  = 0;
    this.params      = [];

}

Seminar.prototype.init = function(){

    this.getMediaInfo();

}

Seminar.prototype.xmlhttprequest = function( url, callback ){
    var req = new XMLHttpRequest();
    req.onreadystatechange = callback;
    req.open( 'GET', url, true );
    req.send( null );
    req = null;
}

Seminar.prototype.getSeminarPosts = function(){

    var self = this;

    this.xmlhttprequest( self.postUrl + '?' + self.params.join('&'), function(){
        if( this.readyState === 4 ){
            self.totalPages = !self.totalPages ? this.getResponseHeader('X-WP-TotalPages') : self.totalPages;
            var data = JSON.parse(this.responseText);
            if( self.callback ) self.callback(data);

            if( self.totalPages > self.currentPage ){
                self.currentPage ++;
                self.params.push( 'page=' + self.currentPage );
                self.getSeminarPosts();
            }
        }
    });

}

Seminar.prototype.getMediaUrl = function(key){

    var self = this;

    this.xmlhttprequest( self.mediaUrl + key, function(){
        if( this.readyState === 4 ){
            var data = JSON.parse(this.responseText);
            var img = document.createElement('img');
            img.src = data['media_details']['sizes']['full']['source_url'];
            document.body.appendChild(img);
        }
    });

}

window.onload = function(){

    var seminar = new Seminar(
        'https://sem.biyo-funai.com',
        ['seminar_cat=16,17'],
    );

    seminar.callback = function(data){
        for(var key in data){
            var p = document.createElement('p');
            var text = document.createTextNode(data[key]['id']);
            p.appendChild(text);
            document.body.appendChild(p);
            this.getMediaUrl(data[key]['custom_fields']['list_img'][0]);
        }
    }

    document.getElementById('btn').onclick = function(){
        seminar.currentPage = 1;
        seminar.params = seminar.params.slice(0,1);
        seminar.getSeminarPosts();
    }


}
