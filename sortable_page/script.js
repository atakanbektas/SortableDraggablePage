$(document).ready(function () {
  //  element  > silinecek eleman,
  //  target   > silinen elamanların gideceği eleman
  //  duration > efekt süresi
  //  callback > efektten sonra çalışacak fonksiyon
  function satiri_sil_efektli(element, target, duration, callback) {
    // Başlangıç ve bitiş pozisyonlarını hesapla
    var startPosition = element.offset();
    var endPosition = $(target).offset();

    // Geçici konteyner oluştur
    var container = $("<div class='custom-transfer-container'></div>")
      .appendTo(document.body)
      .css({
        position: "absolute",
        backgroundColor: "transparent",
        boxShadow: "5px 5px 10px gray",
        border: "3px dashed orange", // Özel efektinize göre stil ekleyebilirsiniz
        margin: 0,
        padding: 0,
        top: startPosition.top,
        left: startPosition.left,
        width: element.outerWidth(),
        height: element.outerHeight(),
        zIndex: 1000,
      });

    // Animasyonu başlat
    container.animate(
      {
        top: endPosition.top,
        left: endPosition.left,
        width: $(target).outerWidth(),
        height: $(target).outerHeight(),
        opacity: 0.5,
      },
      duration,
      function () {
        container.remove();
        element.remove();
        if (callback && typeof callback === "function") {
          callback();
        }
      }
    );
  }

  const menu_left = $(".menu-left");

  const resizable_y_yap = () => {
    $(".resizable-y").resizable({
      handles: "s", // Sadece güney (y ekseni) kenarı ile boyutlandır
      minHeight: 100, // İstediğiniz minimum yüksekliği ayarlayın
      resize: function (event, ui) {
        // Boyutlandırma işlemi tamamlandığında bu fonksiyon çalışacak
        $(this).css({
          width: "", // veya istediğiniz başka bir değer
        });
      },
    });
  };

  const sortable_yap = () => {
    $(".sortable").sortable({
      connectWith: ".sortable",
    });
  };

  const satir_ekle = () => {
    //sol menüye bir satır ekle
    const yeni_satir = $(
      `<div class="row sortable resizable-y ui-resizable ui-sortable" style="min-height: 0; opacity: 0;"></div>`
    );
    menu_left.append(yeni_satir);

    //eklenen satıra animasyon ekle ve sortable-resizable_y yap.
    yeni_satir.animate(
      { opacity: 1, minHeight: 100 },
      {
        duration: 500, // Animasyon süresi
        start: function () {
          yeni_satir.css("display", "flex");
        },
        complete: function () {
          resizable_y_yap();
          sortable_yap();
        },
      }
    );
  };

  //Satırların içinde olduğu div'i yakala ve eğer boş olan bir div varsa onu sil.
  //Boş olan div yoksa alert ver , hiç bir şey silme
  const satir_sil = () => {
    let silinen_satir_var_mi = false;
    //satırların içini gez, eğer satırda data varsa sil, yoksa silme
    $(".menu-left .row").map((index, satir) => {
      // Satır içinde .content-item sınıfına ait öğeleri bul
      const content_item = $(satir).find(".content-item");

      // .content-item öğesi bulundu mu kontrol et
      if (content_item.length === 0) {
        // .content-item öğesi yok ise sil
        //$(satir).animate({ backgroundColor: "orange", opacity: 0 }, 600, function () {
        //    $(this).remove();
        //});
        Swal.fire({
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          customClass: {
            popup: "custom-popup-class", // Özel sınıf tanımla
          },
          allowOutsideClick: false, // Dışarıdaki tıklamaları engellemek için
        });

        satiri_sil_efektli($(satir), "#btn_satir_sil", 600, function () {
          // Transfer efekti tamamlandığında yapılacak işlemler yazılabilir.
        });
        silinen_satir_var_mi = true;
      }
    });
    if (!silinen_satir_var_mi) {
      Swal.fire({
        icon: "error", // Bildirim ikonu (success, error, warning, info)
        title: "Hata!",
        text: "Boş satır bulunamadı.",
        color: "rgba(0,0,0)",
        timer: 2000, // Bildirimin ekranda kalacağı süre (milisaniye cinsinden)
        customClass: {
          popup: "custom-popup-class2", // Özel sınıf tanımla
        },
        showConfirmButton: false, // Tamam butonunu gösterme
      });
    }
  };

  resizable_y_yap();
  sortable_yap();

  //Satır Ekle Butonu Tıklama Eventi
  $("#btn_satir_ekle").on("click", (e) => {
    e.preventDefault();
    satir_ekle();
  });

  //Satır Sil Butonu Tıklama Eventi
  $("#btn_satir_sil").on("click", (e) => {
    e.preventDefault();
    satir_sil();
  });

  $(".row").css("min-height", "100px");

  $(".sortable-row").sortable({});
});
