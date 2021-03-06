const screenAlbum = {
  props: ["album"],
  template: `
    <div class="background-image" @click="closeAlbum">
      <div class="image" :class=[animationImage]>
        <img :src="currentSrcImage" :alt="currentNameImage">
        <small class="name" v-text="currentNameImage"></small>
        <b class="left" @click="left" v-show="leftArrow">&lsaquo;</b>
        <b class="right" @click="right" v-show="rightArrow">&rsaquo;</b>
        <span @click="closeAlbum" class="empty">X</span>
      </div>
    </div>
  `,
  data: () => ({
    currentSrcImage: '',
    currentNameImage: '',
    currentImage: 0,
    leftArrow: false,
    rightArrow: true,
    animationImage: 'close',
  }),
  created() {
    setTimeout(() => {
      this.currentSrcImage = this.album[this.currentImage].src;
      this.currentNameImage = this.album[this.currentImage].name;
      this.animationImage = 'open';
    }, 1);
  },
  methods: {
    left(e) {
      if (this.currentImage == 1) this.leftArrow = false;
      if (this.currentImage > 0) {
        this.animationImage = 'close';
        setTimeout(() => {
          this.rightArrow = true;
          this.currentSrcImage = this.album[--this.currentImage].src;
          this.currentNameImage = this.album[this.currentImage].name;
          this.animationImage = 'open';
        }, 1000);
      }     
    },
    right(e) {
      if (this.currentImage == this.album.length - 2) this.rightArrow = false;
      if (this.currentImage < this.album.length - 1) {
        this.animationImage = 'close';
        setTimeout(() => {
          this.animationImage = 'open';
          this.leftArrow = true;
          this.currentSrcImage = this.album[++this.currentImage].src;
          this.currentNameImage = this.album[this.currentImage].name;
        }, 1000);
      }
    },
    closeAlbum(e) {
      if (e.target.className == 'empty' || e.target.parentNode.attributes[0].nodeValue.indexOf('image') == -1) {
        this.animationImage = 'close';
        setTimeout(() => {
          this.currentSrcImage = '';
          this.currentNameImage = '';

          this.$emit("close", false);
        }, 1000);
      }
    }
  }
}

new Vue({
  el: '#images',
  components: { screenAlbum },
  template: `
    <div class="albums" :class="[showImage]">
      <div id="main" class="container" :style="{zIndex: zIndex}">
        <div id="gallery" class="row">
          <ul class="col-xs-4 gallery-item">
            <li class="album" v-for="thumbnails in allAlbums(images)" @click="openImage">
              <img :src="thumbnails.src" :alt="thumbnails.name" />
              <img :src="thumbnails.src" :alt="thumbnails.name" />
              <p v-text="thumbnails.album"></p>
              <img :src="thumbnails.src" :alt="thumbnails.name" />
            </li>
          </ul>
        </div>
      </div>
      <screenAlbum v-if="gallery" @close="closeAlbum" :album="currentAlbums" />
    </div>
  `,
  data: () => ({
    images: albums,
    gallery: false,
    currentAlbums: [],
    showImage: '',
    zIndex: 0,
  }),
  methods: {
    allAlbums(e) {
      let newTable = [e[0]];
      for (let i = 0; i < e.length; i++) {
        if (e[i-1] && e[i-1].album != e[i].album) newTable.push(e[i])
      }
      return newTable;
    },
    openImage(e) {
      this.gallery = true;
      this.currentAlbums = [];
      this.showImage = 'showImage';
      this.zIndex = -1;
      window.scrollTo( 0, 0 );
      document.body.style.overflow = 'hidden';

      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i].album == e.target.parentElement.textContent.trim() || this.images[i].album == e.target.textContent.trim()) {
          this.currentAlbums.push(this.images[i]);
        }
      }
    },
    closeAlbum(e) {
      if (e == false) {
        document.body.style.overflow = 'auto';
        this.showImage = '';
        this.gallery = e;
        this.zIndex = 0;
      } 
    }
  }
});
