// **** SLIDING ANIMATION ****
var $window = $(window);
var $animation_elementsR, $animation_elementsL;

var animation;

// sliding animation for all videos
function check_if_in_view() {
	$animation_elementsR = $('.right-slide');
	check_if___($animation_elementsR, 'go-right', null);

	$animation_elementsL = $('.left-slide');
	check_if___($animation_elementsL, 'go-left'), null;

	check_if___($('.inner-content'), 'text-anim', null);

	// lottie animation
	check_if___($('#completed'), '', true);
}

function check_if___($animation_elements, clas, anim) {
	var window_height = $window.height();
	var window_top_position = $window.scrollTop();
	var window_bottom_position = (window_top_position + window_height);

	if (!anim) {
		$.each($animation_elements, function () {
			var $element = $(this);
			var element_height = $element.outerHeight();
			var element_top_position = $element.offset().top + 100;
			var element_bottom_position = (element_top_position + element_height) - 100;

			var classList = $element.attr('class').split(/\s+/);

			// console.log("ele:", classList);

			//check to see if this current container is within viewport
			if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
				$element.addClass(clas);
			} else if (classList.includes(clas)) {
				$element.removeClass(clas);
			}
		});
	}

	// for lottie animation
	else {
		var $element = $animation_elements;
		var element_height = $element.outerHeight();
		var element_top_position = $element.offset().top;
		var element_bottom_position = (element_top_position + element_height);

		try {
			//check to see if this current container is within viewport
			if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
				animation.play();
			}
		} catch (e) {
			console.log(e)
		}
	}
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');

/*
$window.on('load', () => {
	// loadAnim();
	console.log("hi")
	try {
		LottieInteractivity.create({
			mode: 'scroll',
			player: '#completed',
			actions: [{
				visibility: [0, 1],
				type: "seek",
				frames: [0, 120],
			}, ]
		});
	} catch (e) {
		console.log(e)
	}
});
*/
$(window).on('load', async () => {

	// console.log("b4 call")

	// await $.get("../content/working.yml", (text, status) => {
	await $.get("https://vedant080102.github.io/auto-dl.github.io/content/working.yml", (text, status) => {

		console.log("Data Status: " + status);

		// Get document, or throw exception on error
		try {
			const data = jsyaml.load(text);
			console.log(data.stepDetails);

			printDetails(data.stepDetails)
		} catch (e) {
			console.log(e);
		}
	});

	// console.log("after call")

	// loading animation when in viewport
	try {
		// 	console.log("lottie animation")
		animation = bodymovin.loadAnimation({
			container: document.getElementById('completed'), // Required
			path: 'https://assets5.lottiefiles.com/packages/lf20_iher6zrq.json', // Required
			renderer: 'svg', // Required
			loop: false, // Optional
			autoplay: false, // Optional
			name: "dunzo", // Name for future reference. Optional.
		})
		animation.pause();
	} catch (e) {
		console.log(e)
	}
});

function printDetails(doc) {
	let ele = document.getElementById('print-steps');
	// console.log(ele)
	let data = ``;

	doc.forEach((item, i) => {
		// console.log(item.title)
		data += `
		<!-- ${i}. ${item.title} -->
		<section class="main-section">
			<div class="step-details">
				<div class="card ${item.theme}-bg">
					<div class="container">
						<div class="step-title mb-5 flex">
							<!-- <div class="rounded-pill shadow-lg px-5 py-2" style="background-color: #464d6154; width: fit-content;"> -->
							<span class="rounded-pill shadow-lg px-5 py-2">
								${item.icon}&ensp;${item.title}</span>
							<!-- </div> -->
						</div>
						<div class="main-row row mt-5 gy-4">
							<div class="col-12 col-md-7">
								<!-- <video class="left-slide step-video" src="media/demo1.mp4" loop autoplay muted></video> -->
								<video class="${item.theme === 'dark' ? 'left-slide' : 'right-slide'} step-video" autoplay muted loop playsinline>
									<!-- <source src="media/demo1.webm" type="video/webm"> -->
									<source src=${item.video} type="video/mp4">
								</video>
							</div>
							<!-- <div class="col-1 step-bullet flex">
								<span class="shadow-lg"><i class="far fa-plus-square"></i></span>
							</div> -->
							<div class="col-12 col-md-5">
								<div class="inner-content">
									${item.details}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		`
	});

	ele.innerHTML = data;
	// console.log(data);
}