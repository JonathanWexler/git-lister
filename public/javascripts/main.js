
$( document )
	.ready( () => {
		let dateOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};

		// $( '.issue_date' )
		//   .each( ( i, date ) => {
		//     console.log( $( date ).text() );
		//     $( date )
		//       .text( new Date( $( date )
		//           .text )
		//         .toLocaleDateString( "en-US", dateOptions ) );
		//   } );

		let star = $( '.star' );
		star.click( ( e ) => {
			$(e.target).addClass('gold');
		} );
	} )
