$(window).on("wheel", function (e) {
	e.preventDefault(); // Prevent the default scroll behavior
	var wheelDelta = e.originalEvent.deltaY;
	var currentScrollPosition = window.pageYOffset;

	// Scrolls slower: adjust multiplier for different speeds
	window.scrollTo({
		top: currentScrollPosition + wheelDelta * 2,
		behavior: "smooth",
	});
});
