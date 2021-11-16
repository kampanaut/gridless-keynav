(() =>
{
	let feed = {
		model: [],
		weights: [],
		currwaet: undefined,
	};
	function ModellizeFeed(container__selector)
	{
		feed.length = 0;
		const instances__container = $(container__selector)[0];
		const grid__insts_sdmarg = parseInt(window.getComputedStyle(instances__container.children[0])["marginLeft"]) * 2,
			grid__body_wdt = instances__container.scrollWidth,
			grid__insts_wdt = Object.values(instances__container.children).map((elem, index) => [index, elem.offsetWidth + grid__insts_sdmarg]);
		const grid__insts_wdt__len = grid__insts_wdt.length;
		let currrow__width = 0, currrow__index = 0, mapped_grid = [[]], k = 0, currrow__count, currrow__sidefiller_left;
		for (let j = 0; j < grid__insts_wdt__len; j++)
		{
			currrow__width += grid__insts_wdt[j][1];
			if (currrow__width > grid__body_wdt)
			{
				currrow__count = mapped_grid[currrow__index].length, currrow__sidefiller_left = ((grid__body_wdt - (currrow__width - grid__insts_wdt[j][1])) / 2) - (grid__insts_sdmarg / 2), currrow__width = 0;
				for (k = 0; k < currrow__count; k++)
				{
					currrow__width += mapped_grid[currrow__index][k][1];
					mapped_grid[currrow__index][k][2] = currrow__width + currrow__sidefiller_left - mapped_grid[currrow__index][k][1] + (grid__insts_sdmarg);
					mapped_grid[currrow__index][k][1] = currrow__width + currrow__sidefiller_left;
				}

				currrow__width = grid__insts_wdt[j][1];
				currrow__index++;
				mapped_grid[currrow__index] = [];
			}
			mapped_grid[currrow__index].push(grid__insts_wdt[j]);
		}
		currrow__count = mapped_grid[currrow__index].length, currrow__sidefiller_left = ((grid__body_wdt - currrow__width) / 2) - (grid__insts_sdmarg / 2), currrow__width = 0;
		for (k = 0; k < currrow__count; k++)
		{
			currrow__width += mapped_grid[currrow__index][k][1];
			mapped_grid[currrow__index][k][2] = currrow__width + currrow__sidefiller_left - mapped_grid[currrow__index][k][1] + (grid__insts_sdmarg);
			mapped_grid[currrow__index][k][1] = currrow__width + currrow__sidefiller_left;
		}
		feed.model = mapped_grid;

		const weights__wdt = grid__body_wdt / 50;
		let weights__total = 0;
		for (i = 0; i < 50; i++)
			feed.weights[i] = parseInt((weights__total += weights__wdt) - (weights__wdt * .50));

		return true;
	};
	const box_insts__count = Math.floor(Math.random() * (30 - 1) + 1);
	const box_feed = $("#box-feed");
	let i, elem;
	elem = document.createElement("div");
	elem.className = "box-insts";
	for (i = 0; i < box_insts__count; i++)
	{
		elem = document.createElement("div");
		elem.className = "box-insts";
		elem.setAttribute("pointed", "false");
		elem.style.width = (Math.floor(Math.random() * (700 - 80) + 80)) + "px";
		box_feed[0].appendChild(elem);
	}
	const box_insts = $(".box-insts");

	ModellizeFeed("#box-feed");

	box_insts.hover(function ()
	{
		this.attributes.pointed.value = "true";
	}, function ()
	{
		this.attributes.pointed.value = "false";
	});

	$(window).on('keydown', function (event)
	{
		switch (event.keyCode)
		{
			case 74:
			case 75:
			case 76:
			case 72:
				{
					let targetBox = $('.box-insts[pointed="true"]'), targetBoxContainer;
					if (targetBox.length || (targetBox = $(".box-insts:hover")).length)
					{
						if (targetBox.is('[pointed="true"]'))
							targetBox.attr("pointed", "false");
						else
							$('.box-insts[pointed="true"]').attr("pointed", "false");
						targetBoxContainer = targetBox.parent();
					}
					else
					{
						$("#box-feed>.box-insts:first-child").attr('pointed', 'true')[0].scrollIntoView({
							behavior: "smooth",
							block: "center",
						});
						feed.currwaet = 0;
						return;
					}
					const targetBoxIndex = targetBox.index();
					// get the information about the grid through the model created by modelizeFeed()
					const grid = (function ()
					{
						const mappedGrid = feed.model, mappedGrid__length = feed.model.length;
						let x, y;
						for (y = 0; y < mappedGrid__length; y++)
						{
							if (mappedGrid[y].filter(([x]) => x == targetBoxIndex).length)
							{
								const mappedRow = mappedGrid[y], mappedRow__length = mappedGrid[y].length;
								for (x = 0; x < mappedRow__length; x++)
									if (targetBoxIndex == mappedRow[x][0])
										break;

								if (targetBox.is(":hover"))
								{
									let k, j, holder_f_a;
									const mappedWeights = [...feed.weights], mappedWeights__length = feed.weights.length;
									for (k = 0; k < mappedWeights__length; k++)
										mappedWeights[k] = [k, Math.abs((mappedRow[x][1] - ((mappedRow[x][1] - mappedRow[x][2]) * .50)) - mappedWeights[k])];
									for (k = 0; k < mappedWeights__length; k++)
										for (j = k + 1; j < mappedWeights__length; j++)
											if (mappedWeights[k][1] > mappedWeights[j][1])
											{
												holder_f_a = mappedWeights[k];
												mappedWeights[k] = mappedWeights[j];
												mappedWeights[j] = holder_f_a;
											}
									feed.currwaet = mappedWeights[0][0];
								}

								return {
									model: mappedGrid,
									rowcount: mappedGrid__length - 1,
									currPOS: [y, x, mappedRow[x][1], mappedRow[x][2]],
								};
							}
						}
					})();
					let nextPOS = [];
					let nextIndex = 0;
					if (event.keyCode == 74 || event.keyCode == 75) // determine if navigation is vertical or not. if this is true, then navigation is vertical;
					{
						// plot the next row location
						if (event.keyCode == 74)
							if (grid.currPOS[0] + 1 > grid.rowcount)
								nextPOS[0] = 0;
							else
								nextPOS[0] = grid.currPOS[0] + 1;
						else
							if (grid.currPOS[0] - 1 < 0)
								nextPOS[0] = grid.rowcount;
							else
								nextPOS[0] = grid.currPOS[0] - 1;

						const nextrow__colcount = grid.model[nextPOS[0]].length,
							row_sample__r = [],
							row_sample__l = [],
							row_sample__c = [];
						let i, j, k, holder_f_a;

						for (i = 0; i < nextrow__colcount; i++)
						{
							row_sample__c[i] = [grid.model[nextPOS[0]][i][0], Math.abs((grid.model[nextPOS[0]][i][1] - ((grid.model[nextPOS[0]][i][1] - grid.model[nextPOS[0]][i][2]) * .50)) - feed.weights[feed.currwaet])];
							row_sample__l[i] = [grid.model[nextPOS[0]][i][0], Math.abs(grid.model[nextPOS[0]][i][2] - feed.weights[feed.currwaet])];
							row_sample__r[i] = [grid.model[nextPOS[0]][i][0], Math.abs(grid.model[nextPOS[0]][i][1] - feed.weights[feed.currwaet])];
						}

						for (i = 0; i < nextrow__colcount; i++)
							for (j = i + 1; j < nextrow__colcount; j++)
							{
								if (row_sample__c[i][1] > row_sample__c[j][1])
								{
									holder_f_a = row_sample__c[i];
									row_sample__c[i] = row_sample__c[j];
									row_sample__c[j] = holder_f_a;
								}
								if (row_sample__l[i][1] > row_sample__l[j][1])
								{
									holder_f_a = row_sample__l[i];
									row_sample__l[i] = row_sample__l[j];
									row_sample__l[j] = holder_f_a;
								}
								if (row_sample__r[i][1] > row_sample__r[j][1])
								{
									holder_f_a = row_sample__r[i];
									row_sample__r[i] = row_sample__r[j];
									row_sample__r[j] = holder_f_a;
								}
							}

						if (row_sample__l[0][1] < row_sample__r[0][1])
							if (row_sample__l[0][1] < 12)
								nextIndex = row_sample__c[0][0];
							else
								nextIndex = row_sample__l[0][0];
						else
							if (row_sample__r[0][1] < 12)
								nextIndex = row_sample__c[0][0];
							else
								nextIndex = row_sample__r[0][0];
					}
					else
					{
						if (event.keyCode == 76)
							if (grid.currPOS[1] + 2 > grid.model[grid.currPOS[0]].length)
								nextIndex = grid.model[grid.currPOS[0]][0][0];
							else
								nextIndex = grid.model[grid.currPOS[0]][grid.currPOS[1] + 1][0];
						else
							if (grid.currPOS[1] - 1 < 0)
								nextIndex = grid.model[grid.currPOS[0]]
								[grid.model[grid.currPOS[0]].length - 1][0];
							else
								nextIndex = grid.model[grid.currPOS[0]][grid.currPOS[1] - 1][0];

						const mappedRow = feed.model[grid.currPOS[0]], mappedRow__length = feed.model[grid.currPOS[0]].length, mappedWeights = [...feed.weights], mappedWeights__length = feed.weights.length;

						let x, k, j, holder_f_a;
						for (x = 0; x < mappedRow__length; x++)
							if (nextIndex == mappedRow[x][0])
								break;
						for (k = 0; k < mappedWeights__length; k++)
							mappedWeights[k] = [k, Math.abs((mappedRow[x][1] - ((mappedRow[x][1] - mappedRow[x][2]) * .50)) - mappedWeights[k])];

						for (k = 0; k < mappedWeights__length; k++)
							for (j = k + 1; j < mappedWeights__length; j++)
								if (mappedWeights[k][1] > mappedWeights[j][1])
								{
									holder_f_a = mappedWeights[k];
									mappedWeights[k] = mappedWeights[j];
									mappedWeights[j] = holder_f_a;
								}

						feed.currwaet = mappedWeights[0][0];
					}
					const new_targetBox = targetBoxContainer.find(`.box-insts:nth-child(${nextIndex + 1})`).attr('pointed', 'true')[0];
					new_targetBox.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
					return false;
				}
			default:
				break;
		}
	});
})();
