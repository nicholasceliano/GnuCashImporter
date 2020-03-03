<template>
  <div class="container">
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input
          type="file"
          multiple
          :name="uploadFieldName"
          @change="filesChange($event.target.files)"
          :accept="acceptedFiles"
          class="input-file"
        />
        <p v-if="uploadedFiles.length === 0">Drag your file(s) here to begin or click to browse</p>
        <p v-if="uploadedFiles.length > 0">Uploaded {{ uploadedFiles.length }} files...</p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FileUpload extends Vue {
  @Prop() acceptedFiles!: string
  @Prop() uploadFieldName!: string

  private uploadedFiles: File[] = []
  private fileCount = 0

  private mounted() {
    this.reset()
  }

  reset() {
    this.uploadedFiles = []
  }

  private filesChange(fileList: FileList) {
    if (!fileList.length) return

    Array.from(Array(fileList.length).keys()).map(x => {
      const uploadedFile = fileList[x]

      if (!this.fileAlreadyUploaded(uploadedFile)) {
        this.uploadedFiles.push(uploadedFile)
      }
    })

    this.$emit('filesChanged', this.uploadedFiles)
  }

  private fileAlreadyUploaded(file: File) {
    return (
      this.uploadedFiles.filter(
        x =>
          x.name === file.name &&
          x.lastModified === file.lastModified &&
          x.path === file.path &&
          x.size === file.size &&
          x.type === file.type
      ).length > 0
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';

.dropbox {
  margin-left: 35px;
  width: calc(100% - 80px);
  outline: 2px dashed $darkgray;
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  height: 100px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue;
}

.dropbox p {
  font-size: 18px;
  text-align: center;
  margin: 0;
  padding:10px;
  height: calc(100% - 20px);
}
</style>
