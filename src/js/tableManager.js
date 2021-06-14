

(function ($) {
    $.fn.tablemanager = function (options = null) {
        var Table   = $(this),
            Heads   = $(this).find("thead th"),
            tbody   = $(this).find("tbody"),
            rows    = $(this).find("tbody tr"),
            rlen    = rows.length,
            arr     = [],
            cells,
            clen;
        var firstSort       = [[0, 0]],
            dateColumn      = [],
            dateFormat      = [],
            disableFilterBy = [];
        var debug = false;
        var debug = options !== null && options.debug == true ? true : false;
        var pagination = false;
        pagination =
            options !== null && options.pagination == true ? true : false;
        // default pagination variables
        var currentPage = 0;
        var numPerPage =
            pagination !== true && showrows_option !== true ? rows.length : 5;
        var numOfPages = options.numOfPages !== undefined && options.numOfPages > 0 ? options.numOfPages : 5;
        var showrows = [5, 10, 50];
        showrows =
            options !== null &&
            options.showrows != "" &&
            typeof options.showrows !== undefined &&
            options.showrows !== undefined
                ? options.showrows
                : showrows;
        var voc_filter_by = "Filter by",
            voc_type_here_filter = "Type here to filter...",
            voc_show_rows = "Show rows";

        var availableOptions = new Array();
        availableOptions = [
            "debug",
            "firstSort",
            "disable",
            "appendFilterby",
            "dateFormat",
            "pagination",
            "showrows",
            "vocabulary",
            "disableFilterBy",
            "numOfPages"
        ];
        arrayOptions = $.map(options, function (value, index) {
            return [index];
        });
        for (i = 0; i < arrayOptions.length; i++) {
            if (availableOptions.indexOf(arrayOptions[i]) === -1) {
                if (debug) {
                    cLog(
                        "Error! " + arrayOptions[i] + " is unavailable option."
                    );
                }
            }
        }
        if (options !== null) {
            if (
                options.vocabulary != "" &&
                typeof options.vocabulary !== undefined &&
                options.vocabulary !== undefined
            ) {

                voc_filter_by =
                    options.vocabulary.voc_filter_by != "" &&
                    options.vocabulary.voc_filter_by !== undefined
                        ? options.vocabulary.voc_filter_by
                        : voc_filter_by;

                voc_type_here_filter =
                    options.vocabulary.voc_type_here_filter != "" &&
                    options.vocabulary.voc_type_here_filter !== undefined
                        ? options.vocabulary.voc_type_here_filter
                        : voc_type_here_filter;

                voc_show_rows =
                    options.vocabulary.voc_show_rows != "" &&
                    options.vocabulary.voc_show_rows !== undefined
                        ? options.vocabulary.voc_show_rows
                        : voc_show_rows;
            }
            if (
                options.disable != "" &&
                typeof options.disable !== undefined &&
                options.disable !== undefined
            ) {
                for (var i = 0; i < options.disable.length; i++) {
                    col =
                        options.disable[i] == -1 || options.disable[i] == "last"
                            ? Heads.length
                            : options.disable[i] == "first"
                            ? 1
                            : options.disable[i];
                    Heads.eq(col - 1)
                        .addClass("disableSort")
                        .removeClass("sortingAsc")
                        .removeClass("sortingDesc");

                    if (isNaN(col - 1)) {
                        if (debug) {
                            cLog('Error! Check your "disable" option.');
                        }
                    }
                }
            }
            var showrows_option = false;
            if (
                options.showrows != "" &&
                typeof options.showrows !== undefined &&
                options.showrows !== undefined
            ) {
                showrows_option = true;

                var numrowsDiv =
                    '<div id="for_numrows" class="for_numrows" style="display: inline;"><label for="numrows">' +
                    translate(voc_show_rows) +
                    ': </label><select id="numrows"></select></div>';
                Table.before(numrowsDiv);
                for (i = 0; i < showrows.length; i++) {
                    $("select#numrows").append(
                        $("<option>", {
                            value: showrows[i],
                            text: showrows[i],
                        })
                    );
                    if (isNaN(showrows[i])) {
                        if (debug) {
                            cLog(
                                'Error! One of your "show rows" options is not a number.'
                            );
                        }
                    }
                }

                var selectNumRowsVal = $("select#numrows").val();
                numPerPage = selectNumRowsVal;
                $("select#numrows").on("change", function () {
                    selectNumRowsVal = $(this).val();
                    currentPage = 0;
                    generatePaginationValues();
                });
            }

            //Pagination
            if (pagination === true || Table.hasClass("tablePagination")) {
                var numPages = Math.ceil(rows.length / numPerPage);
                var pagesDiv =
                    '<div id="pagesControllers" class="pagesControllers"></div>';
                Table.after(pagesDiv);

                if (showrows_option !== true) {
                    var selectNumRowsVal = numPerPage;
                }

                generatePaginationValues();
            }

            if (
                options.disableFilterBy != "" &&
                typeof options.disableFilterBy !== undefined &&
                options.disableFilterBy !== undefined
            ) {
                for (var i = 0; i < options.disableFilterBy.length; i++) {
                    col =
                        options.disableFilterBy[i] == -1 ||
                        options.disableFilterBy[i] == "last"
                            ? Heads.length
                            : options.disableFilterBy[i] == "first"
                            ? 1
                            : options.disableFilterBy[i];
                    Heads.eq(col - 1).addClass("disableFilterBy");

                    if (isNaN(col - 1)) {
                        if (debug) {
                            cLog('Error! Check your "disableFilterBy" option.');
                        }
                    }
                }
            }

            if (
                options.appendFilterby === true ||
                Table.hasClass("tableFilterBy")
            ) {
                var filterbyDiv =
                    '<div id="for_filter_by" class="for_filter_by" style="display: inline;"><label for="filter_by">' +
                    translate(voc_filter_by) +
                    ': </label><select id="filter_by"></select> <input id="filter_input" type="text" placeholder="' +
                    translate(voc_type_here_filter) +
                    '"></div>';
                $(this).before(filterbyDiv);

                $(Heads).each(function (i) {
                    if (!$(this).hasClass("disableFilterBy")) {
                        $("select#filter_by").append(
                            $("<option>", {
                                value: i,
                                text: $(this).text(),
                            })
                        );
                    }
                });

                $("input#filter_input").on("keyup", function () {
                    var val = $.trim($(this).val())
                        .replace(/ +/g, " ")
                        .toLowerCase();
                    var select_by = $("select#filter_by").val();

                    Table.find("tbody tr")
                        .show()
                        .filter(function () {
                            var text = $(this)
                                .find("td:eq(" + select_by + ")")
                                .text()
                                .replace(/\s+/g, " ")
                                .toLowerCase();
                            return !~text.indexOf(val);
                        })
                        .hide();
                        
                    if(val == '') paginate();
                });
            }
            if (
                options.dateFormat != "" &&
                typeof options.dateFormat !== undefined &&
                options.dateFormat !== undefined
            ) {
                for (i = 0; i < options.dateFormat.length; i++) {
                    dateColumn.push(options.dateFormat[i][0] - 1);
                    dateFormat.push([
                        options.dateFormat[i][0] - 1,
                        options.dateFormat[i][1],
                    ]);
                }
                Heads.each(function (col) {
                    if (
                        $(this).data("tablemanager") &&
                        $(this).data("tablemanager").dateFormat !== undefined
                    ) {
                        var dateF = $(this).data("tablemanager").dateFormat;
                        dateColumn.push(col);
                        dateFormat.push([col, dateF]);
                    }
                });
            }

            if (
                options.firstSort != "" &&
                typeof options.firstSort !== undefined &&
                options.firstSort !== undefined
            ) {
                var firstSortColumn = [];
                var firstSortRules = options.firstSort;
                var firstSortOrder = [];
                for (i = 0; i < options.firstSort.length; i++) {
                    firstSortColumn.push(options.firstSort[i][0]);
                    firstSortOrder.push(options.firstSort[i][1]);
                }
                TableSort(firstSortRules);
            }
        }
        if (debug) {
            cLog("Options set:", options);
        }

        Heads.each(function (n) {
            var disable =
                $(this).data("tablemanager") === "disable"
                    ? true
                    : $(this).hasClass("disableSort")
                    ? true
                    : false;

            if (!disable === true) {
                $(this).on("click", function () {
                    if ($(this).hasClass("sortingAsc")) {
                        $(Heads)
                            .removeClass("sortingAsc")
                            .removeClass("sortingDesc");
                        $(this).addClass("sortingDesc");
                        order = 1;
                    } else {
                        $(Heads)
                            .removeClass("sortingDesc")
                            .removeClass("sortingAsc");
                        $(this).addClass("sortingAsc");
                        order = 0;
                    }
                    var sortRules = [];
                    sortRules.push([n + 1, order]);
                    TableSort(sortRules);
                });
                $(this).addClass("sorterHeader");
            }
        });

        function TableSort(rules) {
            cellsArray = [];
            for (i = 0; i < rlen; i++) {
                cells = rows[i].cells;
                clen = cells.length;
                cellsArray[i] = [];
                for (j = 0; j < clen; j++) {
                    cellsArray[i].push(cells[j].outerHTML);
                }
            }
            var firstSortData = [];
            for (i = 0; i < rules.length; i++) {
                var col = rules[i][0] - 1;
                var thead = Heads.eq(col);
                var order =
                    rules[i][1] == undefined
                        ? 0
                        : rules[i][1] == 0 || rules[i][1] == "asc"
                        ? 0
                        : rules[i][1] == 1 || rules[i][1] == "desc"
                        ? 1
                        : 0;
                if (i == 0) {
                    var firstClassOrder =
                        order == 0 ? "sortingAsc" : "sortingDesc";
                    $(thead).addClass(firstClassOrder);
                }
                asc = order == 0 ? 1 : -1;
                if (dateColumn.indexOf(col) != -1) {
                    for (j = 0; j < dateFormat.length; j++) {
                        if (dateFormat[j][0] == col) {
                            var type = "date";
                            var format = dateFormat[j][1];
                        }
                    }
                } else {
                    var type = "alphanumeric";
                    var format = null;
                }
                firstSortData.push([col, asc, type, format]);
            }

            multipleSortCol(cellsArray, firstSortData);

            appendSortedTable(cellsArray);
        }

        function multipleSortCol(array, data) {
            var cols = [];
            var orders = [];
            var types = [];
            var formats = [];
            for (i = 0; i < data.length; i++) {
                cols.push(data[i][0]);
                orders.push(data[i][1]);
                types.push(data[i][2]);
                formats.push(data[i][3]);
            }
            array.sort(function (a, b) {
                for (i = 0; i < cols.length; i++) {
                    var first = "",
                        second = "";
                    var order = orders[i];
                    let firstCol = new DOMParser().parseFromString(
                        a[cols[i]],
                        "text/html"
                    ).documentElement.textContent;
                    let secondCol = new DOMParser().parseFromString(
                        b[cols[i]],
                        "text/html"
                    ).documentElement.textContent;
                    if (i == cols.length && firstCol == secondCol) {
                        return 0;
                    }
                    if (types[i] == "alphanumeric") {
                        if (firstCol > secondCol) {
                            return order;
                        } else if (firstCol < secondCol) {
                            return -1 * order;
                        }
                    } else if (types[i] == "date") {
                        if (
                            formatDate(formats[i], firstCol) >
                            formatDate(formats[i], secondCol)
                        ) {
                            return order;
                        } else if (
                            formatDate(formats[i], firstCol) <
                            formatDate(formats[i], secondCol)
                        ) {
                            return -1 * order;
                        }
                    }
                }
            });
        }

        function appendSortedTable(arr) {

            tbody.html("");
            // append new sorted rows
            tbody.html("<tr>" + arr.join("</tr><tr>") + "</tr>");
            // then launch paginate function (if options.paginate = false it will not do anything)
            paginate();
        }

        function formatDate(dateFormat, date) {
            var $date = date;
            // debug variable
            var format = 0;
            if (dateFormat == "ddmmyyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3$2$1"
                );
                format = 1;
            }
            if (dateFormat == "mmddyyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3$1$2"
                );
                format = 1;
            }
            if (dateFormat == "dd-mm-yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3-$2-$1"
                );
                format = 1;
            }
            if (dateFormat == "mm-dd-yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3-$1-$2"
                );
                format = 1;
            }
            if (dateFormat == "dd/mm/yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3/$2/$1"
                );
                format = 1;
            }
            if (dateFormat == "mm/dd/yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3/$1/$2"
                );
                format = 1;
            }
            // For debugging
            if (format == 0) {
                if (debug) {
                    cLog('Error! Unvalid "date format".');
                }
            }

            return $date;
        }

        function generatePaginationValues() {
            // get first select num rows value
            numPerPage = selectNumRowsVal;
            numPages = Math.ceil(rows.length / numPerPage);
            // append first controllers for pages
            appendPageControllers(numPages);
            // Give currentPage class to first page number
            $(".pagecontroller-num").eq(0).addClass("currentPage");
            paginate(currentPage, numPerPage);
            pagecontrollersClick();
            filterPages();
        }

        function paginate(curPage = null, perPage = null) {
            var curPage = curPage === null ? currentPage : curPage;
            var perPage = perPage === null ? numPerPage : perPage;
            Table.on("paginating", function () {
                $(this)
                    .find("tbody tr")
                    .hide()
                    .slice(curPage * perPage, (curPage + 1) * perPage)
                    .show();
            });
            Table.trigger("paginating");
        }

        function appendPageControllers(nPages) {
            // reset div
            $("#pagesControllers").html("");
            // First
            $("#pagesControllers").append(
                $("<button>", {
                    value: "first",
                    text: "<<",
                    class: "pagecontroller pagecontroller-f",
                })
            );
            // Previous
            $("#pagesControllers").append(
                $("<button>", {
                    value: "prev",
                    text: "<",
                    class: "pagecontroller pagecontroller-p",
                })
            );
            // Numbers
            for (i = 1; i <= nPages; i++) {
                $("#pagesControllers").append(
                    $("<button>", {
                        value: i,
                        text: i,
                        class: "pagecontroller pagecontroller-num",
                    })
                );
            }
            // Next
            $("#pagesControllers").append(
                $("<button>", {
                    value: "next",
                    text: ">",
                    class: "pagecontroller pagecontroller-n",
                })
            );
            // Last
            $("#pagesControllers").append(
                $("<button>", {
                    value: "last",
                    text: ">>",
                    class: "pagecontroller pagecontroller-l",
                })
            );
        }


        function pagecontrollersClick() {
            $(".pagecontroller").on("click", function () {
                // on click on button do something
                if ($(this).val() == "first") {
                    currentPage = 0;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "last") {
                    currentPage = numPages - 1;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "prev") {
                    if (currentPage != 0) {
                        currentPage = currentPage - 1;
                        paginate(currentPage, numPerPage);
                    }
                } else if ($(this).val() == "next") {
                    if (currentPage != numPages - 1) {
                        currentPage = currentPage + 1;
                        paginate(currentPage, numPerPage);
                    }
                } else {
                    currentPage = $(this).val() - 1;
                    paginate(currentPage, numPerPage);
                }
                // Reset class and give to currentPage
                $(".pagecontroller-num").removeClass("currentPage");
                $(".pagecontroller-num")
                    .eq(currentPage)
                    .addClass("currentPage");

                filterPages();
            });
        }

        function filterPages() {
            $(".pagecontroller-num")
                .hide()    
                .filter(function(i, el) {
                    let mid = Math.ceil(numOfPages / 2);
                    if (currentPage < mid) {
                        if(i < numOfPages) return true;
                    } else if(currentPage > (numPages - (numOfPages - 1))) {
                        if(i >= numPages - numOfPages) return true;
                    } else {
                        if(numOfPages % 2 == 0) {
                            if(i >= currentPage - mid && i < currentPage + mid) return true;
                        } else {
                            if(i > currentPage - mid && i < currentPage + mid) return true;
                        }
                    }
                })
                .show();
        }

        function translate(string) {
            return string;
        }

        function cLog(name, string = null) {
            console.log(name);
            if (string != null) {
                console.log(JSON.parse(JSON.stringify(string)));
            }
        }
    };
})(jQuery);
