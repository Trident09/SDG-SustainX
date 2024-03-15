document.addEventListener("DOMContentLoaded", function () {
	let particlesInstance = null;

	const particleColors = [
		"#5d9e75",
		"#87c9c7",
		"#4f9c81",
		"#115426",
		"#76b524",
		"#4f659c",
	];
	updateParticleCountLabels(0);

	particlesJS("particles-js", {
		particles: {
			number: {
				value: 100,
				density: {
					enable: true,
					value_area: 800,
				},
			},
			color: {
				value: particleColors,
			},
			shape: {
				type: "circle",
				stroke: {
					width: 0,
					color: "none",
				},
				polygon: {
					nb_sides: 5,
				},
				image: {
					src: "img/github.svg",
					width: 100,
					height: 100,
				},
			},
			opacity: {
				value: 0.5,
				random: false,
				anim: {
					enable: false,
					speed: 1,
					opacity_min: 0.1,
					sync: false,
				},
			},
			size: {
				value: 10,
				random: false,
				anim: {
					enable: true,
					speed: 5,
					size_min: 6,
					sync: false,
				},
			},
			line_linked: {
				enable: false,
			},
			move: {
				enable: true,
				speed: 2,
				direction: "none",
				random: false,
				straight: false,
				out_mode: "bounce",
				bounce: true,
				attract: {
					enable: false,
					rotateX: 600,
					rotateY: 1200,
				},
			},
		},
		interactivity: {
			detect_on: "canvas",
			events: {
				onhover: {
					enable: true,
					mode: "repulse", // Use 'grab' mode on hover
				},
				onclick: {
					enable: true,
					mode: "grab",
				},
				resize: true,
			},
			modes: {
				repulse: {
					distance: 100,
					duration: 0.4,
				},
			},
		},
		retina_detect: true,
	});

	document
		.getElementById("fetchAndSetParticles")
		.addEventListener("click", async function () {
			try {
				const apiKey = "54c3d78c0a5207198b48229c8b317435";
				// Get city from input field
				const cityName = encodeURIComponent(
					document.getElementById("cityInput").value
				);
				console.log(cityName);

				// Call the async function and wait for it to complete
				await fetchData(cityName, apiKey);

				// Now latitude and longitude are available
				console.log(latitude);
				console.log(longitude);

				// // Check if the values are valid integers
				// if (isNaN(latitude) || isNaN(longitude) || !(-90 <= latitude && 90 >= latitude) || !(-180 <= latitude && 180 >= latitude)) {
				//     alert('Please enter valid integer values for latitude and longitude.');
				//     return; // Stop execution if the values are not valid
				// }

				// Fetch NO2 level from OpenWeatherMap API
				const no2Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"no2"
				);
				// Calculate the number of O3 particles based on the level
				const no2ParticlesNumber = Math.round(no2Level);

				// Fetch O3 level from OpenWeatherMap API
				const o3Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"o3"
				);
				// Calculate the number of O3 particles based on the level
				const o3ParticlesNumber = Math.round(o3Level);

				// Fetch SO2 level from OpenWeatherMap API
				const so2Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"so2"
				);
				// Calculate the number of O3 particles based on the level
				const so2ParticlesNumber = Math.round(so2Level);

				// Fetch PM 2.5 level from OpenWeatherMap API
				const pm2_5Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"pm2_5"
				);
				// Calculate the number of O3 particles based on the level
				const pm2_5ParticlesNumber = Math.round(pm2_5Level);

				// Fetch SO2 level from OpenWeatherMap API
				const pm10Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"pm10"
				);
				// Calculate the number of O3 particles based on the level
				const pm10ParticlesNumber = Math.round(pm10Level);

				// Fetch NH3 level from OpenWeatherMap API
				const nh3Level = await fetchAirPollution(
					apiKey,
					latitude,
					longitude,
					"nh3"
				);
				// Calculate the number of NH3 particles based on the level
				const nh3ParticlesNumber = Math.round(nh3Level);

				const totalParticleCount =
					o3ParticlesNumber +
					so2ParticlesNumber +
					pm2_5ParticlesNumber +
					pm10ParticlesNumber +
					nh3ParticlesNumber;
				await updateParticleCountLabels(
					totalParticleCount,
					o3ParticlesNumber,
					so2ParticlesNumber,
					pm2_5ParticlesNumber,
					pm10ParticlesNumber,
					nh3ParticlesNumber
				);
				generateColorArray(
					o3ParticlesNumber,
					so2ParticlesNumber,
					pm2_5ParticlesNumber,
					pm10ParticlesNumber,
					nh3ParticlesNumber,
					totalParticleCount
				);

				particlesJS("particles-js", {
					particles: {
						number: {
							value: totalParticleCount,
							density: {
								enable: true,
								value_area: 800,
							},
						},
						color: {
							value: generateColorArray(
								o3ParticlesNumber,
								so2ParticlesNumber,
								pm2_5ParticlesNumber,
								pm10ParticlesNumber,
								nh3ParticlesNumber,
								totalParticleCount
							),
						},
						shape: {
							type: "circle",
							stroke: {
								width: 0,
								color: "none",
							},
							polygon: {
								nb_sides: 4,
							},
							image: {
								src: "img/github.svg",
								width: 100,
								height: 100,
							},
						},
						opacity: {
							value: 0.5,
							random: false,
							anim: {
								enable: false,
								speed: 1,
								opacity_min: 0.1,
								sync: false,
							},
						},
						size: {
							value: 10,
							random: false,
							anim: {
								enable: true,
								speed: 2,
								size_min: 6,
								sync: false,
							},
						},
						line_linked: {
							enable: false,
						},
						move: {
							enable: true,
							speed: 2.3,
							direction: "none",
							random: false,
							straight: false,
							out_mode: "bounce",
							bounce: true,
							attract: {
								enable: false,
								rotateX: 600,
								rotateY: 1200,
							},
						},
					},
					interactivity: {
						detect_on: "canvas",
						events: {
							onhover: {
								enable: true,
								mode: "repulse", // Use 'grab' mode on hover
							},
							onclick: {
								enable: true,
								mode: "grab",
							},
							resize: true,
						},
						modes: {
							repulse: {
								distance: 100,
								duration: 0.4,
							},
						},
					},
					retina_detect: true,
				});

				if (particlesInstance) {
					particlesInstance.destroy();
				}
			} catch (error) {
				console.error("An error occurred:", error);
				// alert('An error occurred. Please check the console for details.');
			}
		});

	async function fetchData(cityName, apiKey) {
		try {
			const coordinates = await fetchCoordinates(cityName, apiKey);
			latitude = coordinates.lat;
			longitude = coordinates.lon;

			// Now you can use latitude and longitude here or call another function
			console.log(latitude);
			console.log(longitude);
		} catch (error) {
			// Handle errors here
			console.error("Error:", error);
		}
	}

	async function fetchCoordinates(cityName, apiKey) {
		const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();

			if (data.length === 0) {
				alert(
					`Please enter a valid city name, and do not include states, territories, or country codes in your query.`
				);
				return;
			} else {
				// Return an object with both latitude and longitude
				this.latitude = data[0].lat;
				this.longitude = data[0].lon;
				return { lat: data[0].lat, lon: data[0].lon };
			}
		} catch (error) {
			console.error(`Error fetching coordinates for ${cityName}`, error);
			// You might want to throw the error here or handle it in some way
			throw error;
		}
	}

	async function fetchAirPollution(apiKey, latitude, longitude, pollutant) {
		const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();

			// Extract the specified pollutant level from the API response
			const pollutantLevel = parseFloat(
				data.list[0].components[pollutant]
			);

			return pollutantLevel;
		} catch (error) {
			console.error(`Error fetching ${pollutant} level:`, error);
			return 0; // Default value if there is an error
		}
	}

	async function updateParticleCountLabels(
		count,
		o3ParticlesNumber,
		so2ParticlesNumber,
		pm2_5ParticlesNumber,
		pm10ParticlesNumber,
		nh3ParticlesNumber,
		latitude,
		longitude,
		apiKey
	) {
		const particleCountLabel =
			document.getElementById("particleCountLabel");
		if (count == 0) {
			particleCountLabel.innerHTML = `No particle data available`;
		} else {
			particleCountLabel.innerHTML = `<div class="pure-u-1-2 pure-u-xl-1-5"><img class="icon" style="margin-left: 0" src="./assets/icon-poll/orange.png">O<sup>3</sup>: ${o3ParticlesNumber}</div><div class="pure-u-1-2 pure-u-xl-1-5"><img class="icon" src="./assets/icon-poll/lightblue.png">SO<sup>2</sup>: ${so2ParticlesNumber}</div><div class="pure-u-1-2 pure-u-xl-1-5"><img class="icon" src="./assets/icon-poll/lightgreen.png">PM2.5:&nbsp${pm2_5ParticlesNumber}</div><div class="pure-u-1-2 pure-u-xl-1-5"><img class="icon" src="./assets/icon-poll/darkgreen.png">PM10: ${pm10ParticlesNumber}</div><div class="pure-u-1-2 pure-u-xl-1-5"><img class="icon" src="./assets/icon-poll/darkblue.png">NH<sup>3</sup>: ${nh3ParticlesNumber}</div>`;
		}
	}

	function generateColorArray(
		o3ParticlesNumber,
		so2ParticlesNumber,
		pm2_5ParticlesNumber,
		pm10ParticlesNumber,
		nh3ParticlesNumber,
		totalParticleCount
	) {
		// Calculate the percentage of total particle count for each variable
		const o3Percentage = (o3ParticlesNumber / totalParticleCount) * 100;
		const so2Percentage = (so2ParticlesNumber / totalParticleCount) * 100;
		const pm2_5Percentage =
			(pm2_5ParticlesNumber / totalParticleCount) * 100;
		const pm10Percentage = (pm10ParticlesNumber / totalParticleCount) * 100;
		const nh3Percentage = (nh3ParticlesNumber / totalParticleCount) * 100;

		// Initialize the color array
		const colorArray = [];

		// Function to populate the color array based on percentage and color
		const populateColor = (percentage, color) => {
			const count = Math.round(percentage / 2); // Divide by 2 for the hex code representation
			for (let i = 0; i < count; i++) {
				colorArray.push(color);
			}
		};

		// Populate the color array for each variable
		populateColor(o3Percentage, "#ffc003"); // Orange
		populateColor(so2Percentage, "#7e89bd"); // Light blue
		populateColor(pm2_5Percentage, "#00ff00"); // Green
		populateColor(pm10Percentage, "#40996d"); // Dark green
		populateColor(nh3Percentage, "#1a17c2"); // Dark blue

		// Fill the remaining slots with a default color (e.g., white)
		const remainingCount = 50 - colorArray.length;
		for (let i = 0; i < remainingCount; i++) {
			colorArray.push("#ffffff");
		}

		return colorArray;
	}
});
