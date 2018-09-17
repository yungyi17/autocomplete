$(document).ready(function(){
    var input = $("#theInput")[0];

    $.ajax({
        url:"js/world.json",
        success: function(array) {
            
            var currentFocus;
            
            /*execute a function when someone writes in the text field:*/
            $(input).on("input", function(e){
                var firstElement, secondElement, i, val = this.value;

                /*close any already open lists of autocompleted values*/
                closeAllLists();

                if (!val) { return false;}

                currentFocus = -1;

                /*create a DIV element that will contain the items (values):*/
                firstElement = $("<DIV></DIV>")[0];

                $(firstElement).attr({
                    "id" : this.id + "autocomplete-list",
                    "class" : "autocomplete-items"
                });

                /*append the DIV element as a child of the autocomplete container:*/
                $(this).parent().append(firstElement);

                /*for each item in the array...*/
                for (i = 0; i < array.length; i++) {
                  /*check if the item starts with the same letters as the text field value:*/
                    if (array[i].Name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                        /*create a DIV element for each matching element:*/
                        secondElement = $("<DIV></DIV>")[0];

                        /*make the matching letters bold:*/
                        $(secondElement).append("<strong>" + array[i].Name.substr(0, val.length) + "</strong>");
                        $(secondElement).append(array[i].Name.substr(val.length));

                        /*insert a input field that will hold the current array item's value:*/
                        $(secondElement).append("<input type='hidden' value='" + array[i].Name + "'>");

                        /*execute a function when someone clicks on the item value (DIV element):*/
                        $(secondElement).on("click", function(e) {
                            /*insert the value for the autocomplete text field:*/
                            input.value = this.getElementsByTagName("input")[0].value;
                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        $(firstElement).append(secondElement);
                    }
                }
            });

            /*execute a function presses a key on the keyboard:*/
            $(input).on("keydown", function(e) {
                //var x = document.getElementById(this.id + "autocomplete-list");
                var x = $("#" + this.id + "autocomplete-list")[0];

                if (x) x = x.getElementsByTagName("div");

                if (e.keyCode == 40) {
                    /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
                    currentFocus++;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    }
                }
            });

            function addActive(x) {
                /*a function to classify an item as "active":*/
                if (!x) return false;

                /*start by removing the "active" class on all items:*/
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);

                /*add class "autocomplete-active":*/
                x[currentFocus].classList.add("autocomplete-active");
            }

            function removeActive(x) {
                /*a function to remove the "active" class from all autocomplete items:*/
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }

            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != input) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }

            /*execute a function when someone clicks in the document:*/
            $(document).on("click", function(e){
                closeAllLists(e.target);
            });
        }
    });
});