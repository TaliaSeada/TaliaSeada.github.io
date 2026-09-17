/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
	// AI network backdrop.
		var aiNetworkCanvas = document.querySelector('#intro .ai-network');

		if (!aiNetworkCanvas) {
			var networkWrapper = document.querySelector('#wrapper');

			if (networkWrapper) {
				aiNetworkCanvas = document.createElement('canvas');
				aiNetworkCanvas.className = 'ai-network';
				aiNetworkCanvas.setAttribute('aria-hidden', 'true');
				networkWrapper.appendChild(aiNetworkCanvas);
			}
		}

		if (aiNetworkCanvas) {
			var networkContext = aiNetworkCanvas.getContext('2d');
			var networkNodes = [];
			var networkAnimationFrame;
			var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			var resizeNetwork = function() {
				var networkWidth = aiNetworkCanvas.offsetWidth;
				var networkHeight = aiNetworkCanvas.offsetHeight;
				var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

				aiNetworkCanvas.width = networkWidth * pixelRatio;
				aiNetworkCanvas.height = networkHeight * pixelRatio;
				networkContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

				if (!networkNodes.length) {
					var nodeCount = networkWidth < 600 ? 42 : 82;

					for (var nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
						networkNodes.push({
							x: Math.random() * networkWidth,
							y: Math.random() * networkHeight,
							directionX: (Math.random() - 0.5) * 0.18,
							directionY: (Math.random() - 0.5) * 0.18,
							radius: 1.5 + Math.random() * 2
						});
					}
				}
			};

			var drawNetwork = function() {
				var networkWidth = aiNetworkCanvas.offsetWidth;
				var networkHeight = aiNetworkCanvas.offsetHeight;
				networkContext.clearRect(0, 0, networkWidth, networkHeight);

				for (var firstIndex = 0; firstIndex < networkNodes.length; firstIndex++) {
					var firstNode = networkNodes[firstIndex];

					for (var secondIndex = firstIndex + 1; secondIndex < networkNodes.length; secondIndex++) {
						var secondNode = networkNodes[secondIndex];
						var distanceX = firstNode.x - secondNode.x;
						var distanceY = firstNode.y - secondNode.y;
						var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

						if (distance < 220) {
							networkContext.beginPath();
							networkContext.moveTo(firstNode.x, firstNode.y);
							networkContext.lineTo(secondNode.x, secondNode.y);
							networkContext.strokeStyle = 'rgba(125, 77, 93, ' + (0.2 * (1 - distance / 220)) + ')';
							networkContext.lineWidth = 1;
							networkContext.stroke();
						}
					}

					if (!reducedMotion) {
						firstNode.x += firstNode.directionX;
						firstNode.y += firstNode.directionY;

						if (firstNode.x < -10 || firstNode.x > networkWidth + 10)
							firstNode.directionX *= -1;
						if (firstNode.y < -10 || firstNode.y > networkHeight + 10)
							firstNode.directionY *= -1;
					}

					networkContext.beginPath();
					networkContext.arc(firstNode.x, firstNode.y, firstNode.radius, 0, Math.PI * 2);
					networkContext.fillStyle = 'rgba(201, 119, 147, 0.7)';
					networkContext.fill();
				}

				if (!reducedMotion)
					networkAnimationFrame = window.requestAnimationFrame(drawNetwork);
			};

			resizeNetwork();
			drawNetwork();

			$(window).on('resize.ai-network', function() {
				resizeNetwork();
			});
		}


	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

})(jQuery);