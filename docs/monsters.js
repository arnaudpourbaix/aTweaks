(function () {
  var toggle = document.querySelector(".menu-toggle");
  var sidebar = document.querySelector(".sidebar");
  var backdrop = document.querySelector(".backdrop");

  function closeDrawer() {
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  function openDrawer() {
    if (sidebar) sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
  }

  if (toggle && sidebar && backdrop) {
    toggle.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
    backdrop.addEventListener("click", closeDrawer);
    var menuLinks = sidebar.querySelectorAll("a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", closeDrawer);
    }
  }

  var creatures = document.querySelectorAll(".creature");
  var sidebarLinks = document.querySelectorAll(".sidebar ul ul a");

  function setActive(id) {
    for (var i = 0; i < sidebarLinks.length; i++) {
      var link = sidebarLinks[i];
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", isActive);
      if (isActive) {
        var details = link.closest("details");
        if (details) details.open = true;
      }
    }
  }

  if (creatures.length && sidebarLinks.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) setActive(entries[i].target.id);
        }
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );
    for (var j = 0; j < creatures.length; j++) {
      observer.observe(creatures[j]);
    }
  }
})();
