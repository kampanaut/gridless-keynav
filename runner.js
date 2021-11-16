(() =>
{
	let feed_model = [];
	function ModellizeFeed(container__selector)
	{
		feed_model.length = 0;
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
		feed_model = mapped_grid;
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
						return;
					}
					const targetBoxIndex = targetBox.index();
					// get the information about the grid through the model created by modelizeFeed()
					const grid = (function ()
					{
						const mappedGrid = feed_model;
						const mappedGrid__length = mappedGrid.length;
						let x, y;
						for (y = 0; y < mappedGrid__length; y++)
						{
							if (mappedGrid[y].filter(([x]) => x == targetBoxIndex).length)
							{
								const mappedRow = mappedGrid[y], mappedRow__length = mappedGrid[y].length;
								for (x = 0; x < mappedRow__length; x++)
									if (targetBoxIndex == mappedRow[x][0])
										break;
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

						const nextrow__colcount = grid.model[nextPOS[0]].length;
						const currpos_xtrm_wdt__start = grid.currPOS[2] - (targetBox[0].offsetWidth * .75),
							currpos_xtrm_wdt__mid = grid.currPOS[2] - (targetBox[0].offsetWidth * .50),
							currpos_xtrm_wdt__end = grid.currPOS[2] - (targetBox[0].offsetWidth * .25),
							row_sample__r = [],
							row_sample__l = [];
						let i, k, handler_f_a;
						for (i = 0; i < nextrow__colcount; i++)
							if (grid.model[nextPOS[0]][i][1] > currpos_xtrm_wdt__start)
							{
								row_sample__l.push([...grid.model[nextPOS[0]][i]]);
								row_sample__r.push([...grid.model[nextPOS[0]][i]]);
								i++;
								break;
							}
						for (i; i < nextrow__colcount; i++)
						{
							if ((grid.model[nextPOS[0]][i][2]) < currpos_xtrm_wdt__end)
							{
								row_sample__l.push([...grid.model[nextPOS[0]][i]]);
								row_sample__r.push([...grid.model[nextPOS[0]][i]]);
							}
						}

						if (!row_sample__r.length)
						{
							row_sample__l.push([...grid.model[nextPOS[0]][nextrow__colcount - 1]]);
							row_sample__r.push([...grid.model[nextPOS[0]][nextrow__colcount - 1]]);
						}
						else
						{
							const rowsample__colcount = row_sample__r.length, side_margins__l = parseInt(window.getComputedStyle(targetBox[0])["marginLeft"]), side_margins__r = parseInt(window.getComputedStyle(targetBox[0])["marginRight"]);

							for (i = 0; i < rowsample__colcount; i++)
							{
								row_sample__l[i][2] = Math.abs(row_sample__l[i][2] - currpos_xtrm_wdt__mid + side_margins__l);
								row_sample__r[i][1] = Math.abs(row_sample__r[i][1] - currpos_xtrm_wdt__mid - side_margins__r);
							}

							for (i = 0; i < rowsample__colcount; i++)
							{
								k = i + 1;
								for (k; k < rowsample__colcount; k++)
								{
									if (row_sample__r[i][1] > row_sample__r[k][1])
									{
										handler_f_a = row_sample__r[i];
										row_sample__r[i] = row_sample__r[k];
										row_sample__r[k] = handler_f_a;
									}
									if (row_sample__l[i][2] > row_sample__l[k][2])
									{
										handler_f_a = row_sample__l[i];
										row_sample__l[i] = row_sample__l[k];
										row_sample__l[k] = handler_f_a;
									}
								}
							}

						}

						if (row_sample__l[0][2] < row_sample__r[0][1])
							nextIndex = row_sample__l[0][0];
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
