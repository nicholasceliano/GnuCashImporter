<template>
  <div class="container">
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input
          type="file"
          multiple
          :name="uploadFieldName"
          @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
          :accept="acceptedFiles"
          class="input-file"
        />
        <p v-if="fileCount === 0">Drag your file(s) here to begin or click to browse</p>
        <p v-if="fileCount > 0">Uploaded {{ fileCount }} files...</p>
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

  private uploadedFiles = []
  private fileCount = 0

  data() {
    return {
      uploadedFiles: this.uploadedFiles
    }
  }

  mounted() {
    this.reset()
  }

  reset() {
    this.uploadedFiles = []
  }

  filesChange(fieldName: string, fileList: FileList) {
    const formData = new FormData()

    if (!fileList.length) return

    Array.from(Array(fileList.length).keys()).map(x => {
      formData.append(fieldName, fileList[x], fileList[x].name)
    })
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
  padding: 32px 0;
}
</style>
