javascript:
//Creator: Sophie "Shinko to Kuma"
var exportTable = "";
var playersSupported = {};
//if not on correct page yet, ask which page to go to
if (window.location.href.indexOf('overview_villages&mode=units&type=away_detail&group=0&page=-1&type=away_detail') < 0 && window.location.href.indexOf('overview_villages&mode=units&type=away_detail&group=0&page=-1&type=support_detail') < 0) {

    var content = `<div style=max-width:1000px;>
    <h2 class="popup_box_header">
       <center><u>
          <font color="darkgreen">Support filter</font>
          </u>
       </center>
    </h2>
    <hr>
    <p>
    <center>
       <font color=maroon><b>Select which page you want to go to</b>
       </font>
    </center>
    </p>
    <center> <table><tr><td><center><input type="button"
       class="btn evt-confirm-btn btn-confirm-yes" id="withdraw"
       value="Withdraw">&emsp;</center></td></tr>
       <tr></tr>
       <tr><td><center><input type="button"
          class="btn evt-cancel-btn btn-confirm-yes" id="sendback"
          value="Send back">&emsp;</center></td></tr>
          <tr></tr>
       <tr><td><center><input type="button"  class="btn evt-cancel-btn btn-confirm-no"
          id="close_this" value="Close this window">&emsp;</center></td></tr>
          </table>
    </center>
    <br>
    <hr>
    <center><img class="tooltip-delayed"
       title="<font color=darkgreen>Sophie -Shinko to Kuma-</font>"
       src="https://dl.dropboxusercontent.com/s/0do4be4rzef4j30/sophie2.gif"
       style="cursor:help; position: relative"></center>
    <br>
    <center>
       <p>Creator: <a
          href="https://forum.tribalwars.net/index.php?members/shinko-to-kuma.121220/"
          title="Sophie profile" target="_blank">Sophie "Shinko
          to Kuma"</a>
       </p>
    </center>
 </div>`;
    Dialog.show('Supportfilter', content);
    $("#withdraw").click(function () {
        window.location.assign(game_data.link_base_pure + "overview_villages&mode=units&type=away_detail&group=0&page=-1&type=away_detail");
    });
    $("#sendback").click(function () {
        window.location.assign(game_data.link_base_pure + "overview_villages&mode=units&type=away_detail&group=0&page=-1&type=support_detail");
    });
    $("#close_this").click(function () {
        var close_this = document.getElementsByClassName(
            'popup_box_close');
        close_this[0].click();
    });
}

function search_table() {


    //html part here, table to prepend is units_table
    if ($('#button').length == 0) {
        var onlyShowOutsideSupport = false;
        body = document.getElementById("paged_view_content");
        htmlString = `
            <div id="supportQuery">
                <table id="filterTable" class="vis">
                    <thead>
                        <tr>
                            <th>Filter</th>
                            <th style="text-align:center" width="">Amount currently filtered</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Find only Offensive selfsupport</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>
                            <input type="text" ID="search_field_input" name="filter" size="20" margin="5" align=left>
                        </td>
                        <td>
                            <span id="filterCount">Currently 0 filtered</span>
                        </td>
                        <td>
                            <input type="checkbox" ID="showOnlyFiltered" name="showOnlyFiltered"> Show only external support
                        </td>

                        <td margin="5">
                            <button type="button" ID="button" class="btn-confirm-yes" >Filter for player/tribe</button>
                        </td>
                        <td margin="5">
                            <button type="button" ID="withdraw" class="btn" ></button>
                        </td>
                        <td margin="5">
                        <button type="button" ID="findOffensive" class="btn" onclick="filterOffensiveSupport()" >Select leftover offense</button>
                    </td>
                        <thead id="supportList">
                        </thead>
                    </tbody>
                </table>
                </br>
            </div>`.trim();

        var buttonText = document.getElementsByName("submit_units_back")[0].value;

        supportDiv = document.createElement('div');
        supportDiv.innerHTML = htmlString;
        body.prepend(supportDiv.firstChild);
        $('#supportQuery').prepend(`<div id="exportTable" style="display:none"><textarea id="textField" cols="60" rows="2" placeholder="After filtering export data will be placed here"></textarea></div>`);
        document.getElementById("withdraw").innerText = buttonText;
        $('#withdraw').click(function () {
            document.getElementsByName("submit_units_back")[0].click();
        });

        document.getElementById("showOnlyFiltered").addEventListener("change", function () {
            if (document.getElementById("showOnlyFiltered").checked == true) {
                onlyShowOutsideSupport = true;
            }
            else {
                onlyShowOutsideSupport = false;
            }
        });



        $('#button').click(function () {
            //clear extra rows
            /*count = 0;
            for (var prop in playersSupported) {
                if (!playersSupported.hasOwnProperty(prop)) continue;
                count++;
            }
            $('#textField')[0].value = '';
            deleterows("filterTable", count * 7);
            for (var prop in playersSupported) {
                if (playersSupported.hasOwnProperty(prop))
                    delete playersSupported[prop];
            }
*/
            $(".undefined").remove();
            $('#filterTable tr.header').remove();

            //filter here
            // Declare variables
            $('#supportList').empty();
            $('#supportList').append(`<tr>
                <th>Player</th>
                <th>Tribe</th>
                <th>Selection count</th>
                <th>Population</th>
                <th></th>
            </tr>`);
            exportTable = "";
            var input, filter, i;
            input = document.getElementById("search_field_input");
            filter = input.value.toUpperCase();
            checkboxes = document.getElementsByClassName("village_checkbox");

            //reseting all checkboxes and counter
            amountChecked = 0;
            count = 0;
            for (i = 0; i < checkboxes.length; i++) checkboxes[i].checked = false;

            //checking if filter is empty
            if (filter == "" || filter.length < 2) return;

            //checking through all the checkboxes
            for (i = 0; i < checkboxes.length; i++) {
                //checking if support is at another player
                supportedPlayer = checkboxes[i].nextElementSibling.nextElementSibling;
                if (supportedPlayer) {
                    supportInfo = playersSupported[supportedPlayer.innerHTML];
                    playerName = supportedPlayer.innerHTML;
                    tribeName = checkboxes[i].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
                    if ($("#units_table").find("tr:first th").length == 15) {
                        if (!supportInfo) {
                            supportInfo = [
                                {
                                    name: playerName,
                                    tribe: tribeName,
                                    count: 0,
                                    spear: 0,
                                    sword: 0,
                                    axe: 0,
                                    archer: 0,
                                    scout: 0,
                                    light: 0,
                                    marcher: 0,
                                    heavy: 0,
                                    knight: 0,
                                    snob: 0,
                                    population: 0
                                }
                            ];
                            playersSupported[supportedPlayer.innerHTML] = supportInfo;
                        }
                    } else if ($("#units_table").find("tr:first th").length == 13) {
                        if (!supportInfo) {
                            supportInfo = [
                                {
                                    name: playerName,
                                    tribe: tribeName,
                                    count: 0,
                                    spear: 0,
                                    sword: 0,
                                    axe: 0,
                                    scout: 0,
                                    light: 0,
                                    heavy: 0,
                                    knight: 0,
                                    snob: 0,
                                    population: 0
                                }
                            ];
                            playersSupported[supportedPlayer.innerHTML] = supportInfo;
                        }
                    }

                    //check if support is at the right player
                    if (supportedPlayer.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        checkboxes[i].checked = true;
                        amountChecked++;
                        supportInfo[0].count++;
                        if ($("#units_table").find("tr:first th").length == 15) {
                            supportInfo[0].spear = parseInt(supportInfo[0].spear) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.innerHTML);
                            supportInfo[0].sword = parseInt(supportInfo[0].sword) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].axe = parseInt(supportInfo[0].axe) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].archer = parseInt(supportInfo[0].archer) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].scout = parseInt(supportInfo[0].scout) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].light = parseInt(supportInfo[0].light) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].marcher = parseInt(supportInfo[0].marcher) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].heavy = parseInt(supportInfo[0].heavy) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].knight = parseInt(supportInfo[0].knight) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].snob = parseInt(supportInfo[0].snob) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].population = supportInfo[0].spear + supportInfo[0].sword + supportInfo[0].axe + supportInfo[0].archer + supportInfo[0].scout * 2 + supportInfo[0].light * 4 + supportInfo[0].heavy * 6 + supportInfo[0].marcher * 5 + supportInfo[0].knight * 10 + supportInfo[0].snob * 100;
                        }
                        else {
                            supportInfo[0].spear = parseInt(supportInfo[0].spear) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.innerHTML);
                            supportInfo[0].sword = parseInt(supportInfo[0].sword) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].axe = parseInt(supportInfo[0].axe) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].scout = parseInt(supportInfo[0].scout) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].light = parseInt(supportInfo[0].light) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].heavy = parseInt(supportInfo[0].heavy) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].knight = parseInt(supportInfo[0].knight) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].snob = parseInt(supportInfo[0].snob) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                            supportInfo[0].population = supportInfo[0].spear + supportInfo[0].sword + supportInfo[0].axe + supportInfo[0].scout * 2 + supportInfo[0].light * 4 + supportInfo[0].heavy * 6 + supportInfo[0].knight * 10 + supportInfo[0].snob * 100;


                        }

                    }
                    else
                        //check if filtered on tribe instead
                        if (checkboxes[i].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML.toUpperCase().indexOf(filter) > -1) {
                            checkboxes[i].checked = true;
                            amountChecked++;
                            supportInfo[0].count++;
                            if ($("#units_table").find("tr:first th").length == 15) {
                                supportInfo[0].spear = parseInt(supportInfo[0].spear) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.innerHTML);
                                supportInfo[0].sword = parseInt(supportInfo[0].sword) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].axe = parseInt(supportInfo[0].axe) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].archer = parseInt(supportInfo[0].archer) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].scout = parseInt(supportInfo[0].scout) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].light = parseInt(supportInfo[0].light) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].marcher = parseInt(supportInfo[0].marcher) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].heavy = parseInt(supportInfo[0].heavy) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].knight = parseInt(supportInfo[0].knight) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].snob = parseInt(supportInfo[0].snob) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].population = supportInfo[0].spear + supportInfo[0].sword + supportInfo[0].axe + supportInfo[0].archer + supportInfo[0].scout * 2 + supportInfo[0].light * 4 + supportInfo[0].heavy * 6 + supportInfo[0].marcher * 5 + supportInfo[0].knight * 10 + supportInfo[0].snob * 100;
                            }
                            else {
                                supportInfo[0].spear = parseInt(supportInfo[0].spear) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.innerHTML);
                                supportInfo[0].sword = parseInt(supportInfo[0].sword) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].axe = parseInt(supportInfo[0].axe) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].scout = parseInt(supportInfo[0].scout) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].light = parseInt(supportInfo[0].light) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].heavy = parseInt(supportInfo[0].heavy) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].knight = parseInt(supportInfo[0].knight) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].snob = parseInt(supportInfo[0].snob) + parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                                supportInfo[0].population = supportInfo[0].spear + supportInfo[0].sword + supportInfo[0].axe + supportInfo[0].scout * 2 + supportInfo[0].light * 4 + supportInfo[0].heavy * 6 + supportInfo[0].knight * 10 + supportInfo[0].snob * 100;
                            }
                        }
                }
                else {
                    //not our filter, need to hide?
                    if (onlyShowOutsideSupport == true) {
                        checkboxes[i].parentNode.parentNode.parentNode.style.display = 'none';
                    }
                }
            }
            $('span#filterCount').html("Currently " + amountChecked + " filtered");
            for (var prop in playersSupported) {
                if (!playersSupported.hasOwnProperty(prop)) continue;
                var info = playersSupported[prop];
                createTable([[info[0].name, info[0].tribe, numberWithCommas(info[0].count), numberWithCommas(info[0].population) + " pop", ""]], "header");
                exportTable += "[spoiler=Support at/from " + info[0].name + "]\n[table][**]" + info[0].name + "[||]" + info[0].tribe + "[||]" + numberWithCommas(info[0].count) + "[||]" + numberWithCommas(info[0].population) + "[||]pop[/**]\n";
                if ($("#units_table").find("tr:first th").length == 13) {
                    createTable([["", "Spear", numberWithCommas(info[0].spear), "Scout", numberWithCommas(info[0].scout)], ["", "Sword", numberWithCommas(info[0].sword), "Light", numberWithCommas(info[0].light)], ["", "Axe", numberWithCommas(info[0].axe), "Heavy", numberWithCommas(info[0].heavy)], ["", "Paladin", info[0].knight, "Noble", info[0].snob]]);
                    exportTable += "[*][|][unit]spear[/unit][|]" + numberWithCommas(info[0].spear) + "[|][unit]spy[/unit][|]" + numberWithCommas(info[0].scout) + "[*][|][unit]sword[/unit][|]" + numberWithCommas(info[0].sword) + "[|][unit]light[/unit][|]" + numberWithCommas(info[0].light) + "[*][|][unit]axe[/unit][|]" + numberWithCommas(info[0].axe) + "[|][unit]heavy[/unit][|]" + numberWithCommas(info[0].heavy) + "[*][|][unit]knight[/unit][|]" + numberWithCommas(info[0].knight) + "[|][unit]snob[/unit][|]" + numberWithCommas(info[0].snob) + "\n";
                }
                else {
                    createTable([["", "Spear", numberWithCommas(info[0].spear), "Scout", numberWithCommas(info[0].scout)], ["", "Sword", numberWithCommas(info[0].sword), "Light", numberWithCommas(info[0].light)], ["", "Axe", numberWithCommas(info[0].axe), "Heavy", numberWithCommas(info[0].heavy)], ["", "Archer", numberWithCommas(info[0].archer), "Mounted Archer", numberWithCommas(info[0].marcher)], ["", "Paladin", info[0].knight, "Noble", info[0].snob]]);
                    exportTable += "[*][|][unit]spear[/unit][|]" + numberWithCommas(info[0].spear) + "[|][unit]spy[/unit][|]" + numberWithCommas(info[0].scout) + "[*][|][unit]sword[/unit][|]" + numberWithCommas(info[0].sword) + "[|][unit]light[/unit][|]" + numberWithCommas(info[0].light) + "[*][|][unit]axe[/unit][|]" + numberWithCommas(info[0].axe) + "[|][unit]heavy[/unit][|]" + numberWithCommas(info[0].heavy) + "[*][|][unit]archer[/unit][|]" + numberWithCommas(info[0].archer) + "[|][unit]marcher[/unit][|]" + numberWithCommas(info[0].marcher) + "[*][|][unit]knight[/unit][|]" + numberWithCommas(info[0].knight) + "[|][unit]snob[/unit][|]" + numberWithCommas(info[0].snob) + "\n";
                }
                createTable([["", "", "", "", ""]]);
                createTable([["", "", "", "", ""]]);
                exportTable += "[/table][/spoiler]\n";
            }
            for (i = 0; i < $('#filterTable tr.header').length; i++) {
                collapse(i);
            }
            $('#textField')[0].value = exportTable;
            $('#exportTable')[0].style.display = "block";
        });

    }
    function createTable(tableData, style) {

        var tableBody = document.getElementById("filterTable");

        tableData.forEach(function (rowData) {
            var row = document.getElementById("filterTable").insertRow("-1");
            row.className = style;



            rowData.forEach(function (cellData) {
                var cell = document.createElement('td');
                cell.appendChild(document.createTextNode(cellData));
                if (style == "header") {
                    cell.style.backgroundColor = "#c1a264";
                    cell.style.backgroundImage = "url('https://dsen.innogamescdn.com/asset/fa6f0423/graphic/screen/tableheader_bg3.png')";
                    cell.style.backgroundRepeat = "repeat-x";
                    cell.style.fontWeight = "bold";
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
        for (i = 0; i < $('#filterTable tr.header').length; i++) {
            $('#filterTable tr.header')[i].children[4].innerHTML = `<img data-hidden="false" class="toggle" style="display:block; margin-left: auto; margin-right: auto;cursor:pointer;" src="graphic/minus.png" onclick=collapse(` + i + `)></img>`;
        }
    }

    function deleterows(tableID, amount) {
        if (amount != 0) {
            var rowCount;
            while (amount > 0) {
                rowCount = document.getElementById(tableID).getElementsByTagName("tr").length;
                document.getElementById(tableID).deleteRow(rowCount - 1);
                amount--;
            }
        }
    }

}

function collapse(groupToMinimize) {

    if ($('#filterTable tr.header')[groupToMinimize].children[4].children[0].src == window.location.origin + "/graphic/plus.png") {
        $('#filterTable tr.header')[groupToMinimize].children[4].children[0].src = "/graphic/minus.png";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.style = "display:table-row";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.style = "display:table-row";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.style = "display:table-row";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:table-row";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:table-row";;
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:table-row";
    }
    else {
        $('#filterTable tr.header')[groupToMinimize].children[4].children[0].src = "/graphic/plus.png";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.style = "display:none";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.style = "display:none";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.style = "display:none";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:none";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:none";
        $('#filterTable tr.header')[groupToMinimize].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style = "display:none";
    }
}



search_table();

function filterOffensiveSupport() {
    javascript:
    amount = 0;
    playersSupported = {};
    checkboxes = document.getElementsByClassName("village_checkbox");
    for (i = 0; i < checkboxes.length; i++) checkboxes[i].checked = false;

    for (i = 0; i < checkboxes.length; i++) {
        //checking if support is at another player
        supportedPlayer = checkboxes[i].nextElementSibling.nextElementSibling;
        if (typeof supportInfo == 'undefined') {
            var supportInfo = [
                {
                    axe: 0,
                    light: 0
                }
            ];
        }
        if (supportedPlayer) {
            // hide external support
            //checkboxes[i].parentNode.parentNode.parentNode.style.display = 'none';
        }
        else {
            playersSupported["player"] = supportInfo;
        }
        if ($("#units_table").find("tr:first th").length == 15) {
            axesInVillage = parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
            supportInfo[0].axe = parseInt(supportInfo[0].axe) + axesInVillage;
            lightInVillage = parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
            supportInfo[0].light = parseInt(supportInfo[0].light) + lightInVillage;
        }
        else {
            axesInVillage = parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
            supportInfo[0].axe = parseInt(supportInfo[0].axe) + axesInVillage;
            lightInVillage = parseInt(checkboxes[i].parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
            supportInfo[0].light = parseInt(supportInfo[0].light) + lightInVillage;

        }
        if ((axesInVillage > 25 || lightInVillage > 3) && checkboxes[i].nextElementSibling.nextElementSibling == null) {
            // tick checkbox
            console.log("Discovered " + supportInfo[0].axe + " and " + supportInfo[0].light);
            checkboxes[i].checked = true;
            amount++;
        }
        else {
            // hiding unrelated rows
            checkboxes[i].parentNode.parentNode.parentNode.style.display = 'none';
        }
    }

    amountChecked = 0;
    for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true)
            amountChecked++;
    }
    console.log("finished, found a total of " + amount + " supports and checked them");
    console.log("checked " + amountChecked + " out of a total of " + checkboxes.length);

    console.log("Selected " + supportInfo[0].axe + " axe and " + supportInfo[0].light + " light cavalry ");
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1.$2");
    return x;
}
