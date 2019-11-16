$(function() {
  $(".eventbox").css({ opacity: "0" });

  $.ajax({
    type: "GET",
    url:
      "https://cdnjs.cloudflare.com/ajax/libs/jquery-sheetrock/1.1.4/dist/sheetrock.min.js",
    success: function() {
      //mySheetrockCallback
      var eventboxCallback = function(error, options, response) {
        if (!error) {
          /*Parse response.data, loop through response.rows, or do something with response.html.*/
        }

        setTimeout(function() {
          // hyperlinks
          $("table#eventBox td").each(function() {
            var plaintxt = $(this).html();
            var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.\-]*(\?\S+)?)?)?)/gi;
            var txt2hyperlinks = plaintxt.replace(
              regex,
              "<span class='inline-link-1'><a href='$1' target='_blank' class='infolink'>$1</a></span>"
            );
            $(this).html(txt2hyperlinks);
          });

          $("table#eventBox")
            .find("a")
            .each(function() {
              var linkslice = $(this).html();
              var url2http = linkslice.slice(0, 4);
              var y = document.getElementsByClassName("infolink");
              var i;
              for (i = 0; i < y.length; i++) {
                y[i].innerHTML = url2http;
              }
            });

          $("table#eventBox td")
            .find("a")
            .each(function() {
              var httptxt = $(this).html();
              var http2VIEW = httptxt.replace(
                /http/gi,
                'MORE INFO <i class="fa fa-external-link"></i>'
              );
              $(this).html(http2VIEW);
            });

          //plain text email addresses into clickable mailto
          $("table#eventBox td").filter(function() {
            var html = $(this).html();
            var emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;
            var matched_str = $(this)
              .html()
              .match(emailPattern);
            if (matched_str) {
              var text = $(this).html();
              $.each(matched_str, function(index, value) {
                text = text.replace(
                  value,
                  "<span class='inline-link-1'><a href='mailto:" +
                    value +
                    "'>" +
                    value +
                    "</a><span>"
                );
              });
              $(this).html(text);
              return $(this);
            }
          });

          //Bold (h5) Markup ~text~
          $("table#eventBox")
            .children()
            .each(function() {
              $(this).html(
                $(this)
                  .html()
                  .replace(/~(.*?)~/gm, '<h5 class="ebox-h5">$1</h5>')
              );
            });

          if ($("table#eventBox tr:nth-child(1) td").text().length > 0) {
            //$("table#eventBox").show();
            $(".eventbox")
              .delay(500)
              .animate({ opacity: "1" }, { duration: 250, easing: "linear" });

            //$(".eventbox").removeClass("eventboxbg2").addClass("eventboxbg1");
            //console.log("content");
          } else if (
            $("table#eventBox tr:nth-child(1) td").text().length == 0
          ) {
            //$("table#eventBox").hide();
            //$(".eventbox").removeClass("eventboxbg1").addClass("eventboxbg2");
            //console.log("empty");
          }
        }, 150); //timeout
      }; //eventboxCallback

      // CDPL GDrive Sheetrock Event/Promo Box
      $("#inputbox").keyup(function() {
        var url_text = $(this).val();
        //var url_format=/\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;
        var url_format = /\b(https):\/\/(docs.google.com\/spreadsheets\/d)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        if (url_text.match(url_format)) {
          //$("#loader").fadeIn(300).html('<h4 class="txt-green">Loading Saved Form...</h4>');
          //$("#result").css({'display': 'block'}).fadeIn(300).attr('src',url_text);
          var eventboxSpreadsheet = $("#inputbox").val();
          //console.log(eventboxSpreadsheet)
          $("#input-valid, #input-error").hide();
        } else {
          $("#input-error").html(
            "Must be valid Google Drive Spreadsheet Shared Link"
          );
        }

        //var eventboxSpreadsheet = "https://docs.google.com/spreadsheets/d/1cA9JxViTtTb2GHB2Tj748f0XzXn9ZqxefrBXBnITBFQ/edit#gid=0";

        $("#eventBox").sheetrock({
          url: eventboxSpreadsheet,
          query: "select A, B, E where Y='DWAYNE E LIVINGSTON II'",
          headersOff: false,
          callback: eventboxCallback
        });
      });
    }, //end success:function
    dataType: "script",
    cache: true
  });
}); //end function
