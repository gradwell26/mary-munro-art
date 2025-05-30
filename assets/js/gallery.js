document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("gallery-grid");
  console.log("Gallery grid:", document.getElementById("gallery-grid"));
  const filterTags = document.getElementById("filter-tags");
  const modal = document.getElementById("artwork-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalMedium = document.getElementById("modal-medium");
  const modalDimensions = document.getElementById("modal-dimensions");
  const modalPrice = document.getElementById("modal-price");
  const modalTags = document.getElementById("modal-tags");
  const modalContact = document.getElementById("modal-contact");
  const modalClose = document.getElementById("modal-close");

  let artworks = [];
  let selectedTags = new Set();

fetch("/data/artworks.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("Loaded artworks:", data); // ← Add this line
    artworks = data;
    renderFilters(artworks);
    renderGallery(artworks);
  });


  function renderFilters(data) {
    const allTags = new Set();
    data.forEach((art) => art.tags.forEach((tag) => allTags.add(tag)));

    [...allTags].sort().forEach((tag) => {
      const btn = document.createElement("a");
      btn.href = "#";
      btn.textContent = tag;
      btn.classList.add("tag-link");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.classList.toggle("selected");
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
        } else {
          selectedTags.add(tag);
        }
        renderGallery(data);
      });
      filterTags.appendChild(btn);
    });
  }

  function renderGallery(data) {
    galleryGrid.innerHTML = "";

    const filtered = [...data].filter((art) =>
    selectedTags.size === 0
    ? true
    : [...selectedTags].some((tag) => art.tags.includes(tag))
    );


    filtered.forEach((art) => {
      const thumb = document.createElement("img");
      thumb.src = `assets/images/${art.image}`;
      thumb.alt = art.title;
      thumb.classList.add("thumb");
      thumb.loading = "lazy";

      thumb.addEventListener("click", () => {
        modalImage.src = `assets/images/${art.image}`;
        modalTitle.textContent = art.title;
        modalMedium.textContent = art.medium;
        modalDimensions.textContent = art.dimensions;
        modalPrice.textContent = art.price;
        modalTags.textContent = art.tags.join(", ");
        modalContact.href = `mailto:art@catchword.ca?subject=Purchase Inquiry: ${encodeURIComponent(art.title)}`;
        modal.classList.remove("hidden");
      });

      galleryGrid.appendChild(thumb);
    });
     console.log("Rendering", data.length, "artworks");
     console.log(`Appended thumbnail for: ${art.title}`);
  }

  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});


