<?php

//返す値
$return_posts = array();

//POSTデータ
$seminar_url    = isset($_POST['seminar_url']) ? $_POST['seminar_url'] : '';
$seminar_cat    = isset($_POST['seminar_cat']) ? $_POST['seminar_cat'] : '';
$current_page   = isset($_POST['current_page']) ? $_POST['current_page'] : '';

//URL設定
$base_url  = $seminar_url."/wp-json/wp/v2";
$post_url  = $base_url."/seminar/?".$seminar_cat."&page=".$current_page;
$cat_url   = $base_url."/seminar_cat/";
$media_url = $base_url."/media/";

//総件数取得
$headers = get_headers($post_url, 1);
$total_page = $headers["X-WP-TotalPages"];

//セミナー記事取得
$posts = file_get_contents( $post_url );
$posts = json_decode( $posts, true );

//今日の日付
$today = strtotime(date("Y-m-d"));

//記事ループ
foreach( $posts as $post ){

   //サムネイル取得
   $thumbnail = file_get_contents( $media_url.$post['custom_fields']['list_img'][0] );
   $thumbnail = json_decode( $thumbnail, true );

   //カテゴリー取得
   $categories = array();
   foreach( $post['seminar_cat'] as $category ){
       $category = file_get_contents( $cat_url.$category );
       $category = json_decode($category,true);
       array_push( $categories, $category['name'] );
   }

   //記事データ出力
   array_push( $return_posts, array(
       'total_page'         => $total_page,
       'title'              => $post['title']['rendered'],
       'thumbnail'          => $thumbnail['media_details']['sizes']['full']['source_url'],
       'categories'         => $categories,
       'permalink'          => $post['guid']['rendered'],
       'date'               => date( 'Y.m.d', strtotime($post['date']) ),
       'seminar_date'       => date( 'Y年m月d日', strtotime($post['custom_fields']['list_date'][0]) ),
       'seminar_entry_date' => date( 'Y年m月d日', strtotime( $post['custom_fields']['entry_date-end'][0] ) )
   ));

}

echo json_encode( $return_posts );
exit();


 ?>
