$(document).ready(function () {
	// Updated mousemove function to properly track the cursor with scrolling
	$(document)
		.mousemove(function (e) {
			requestAnimationFrame(function () {
				// Ensures the trail is removed smoothly
				var scrollLeft = $(window).scrollLeft();
				var scrollTop = $(window).scrollTop();

				// Update cursor position to follow the mouse
				$(".cursor")
					.css({
						left: e.clientX, // Using clientX and clientY for consistency
						top: e.clientY,
					})
					.show();

				// Create trail particle
				var trailPart = $('<div class="trail"></div>');
				$("#trail-container").append(trailPart);
				trailPart.css({
					left: e.clientX - 3 + scrollLeft, // Offset to center and add scrollLeft for horizontal scroll
					top: e.clientY - 3 + scrollTop, // Offset to center and add scrollTop for vertical scroll
				});

				// Set the trail particle to fade out and remove
				setTimeout(function () {
					trailPart.css("opacity", 0);
					setTimeout(function () {
						trailPart.remove();
					}, 800); // Time in milliseconds to match the CSS transition-duration
				}, 20);
			});
		})
		.mouseleave(function () {
			$(".cursor").hide(); // Hide cursor when the mouse leaves the window
		});

	// Initial setup for hover state on links
	$("a")
		.mouseenter(function () {
			$(".cursor").addClass("hover");
		})
		.mouseleave(function () {
			$(".cursor").removeClass("hover");
		});

	// Toggle cursor image every 250 milliseconds
	setInterval(function () {
		var cursorImage = $(".cursor img");
		var currentSrc = cursorImage.attr("src");
		var newSrc =
			currentSrc === "https://i.ibb.co/tXrLb7v/butterfly1.png"
				? "https://i.ibb.co/1djnTSz/butterfly2.png" // Path to the second butterfly image
				: "https://i.ibb.co/tXrLb7v/butterfly1.png";
		cursorImage.attr("src", newSrc);
	}, 250); // Change the image every 250 milliseconds
});
