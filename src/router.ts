import { Vue } from 'vue-property-decorator'
import FileImporter from './components/content/FileImporter.vue'
import QuoteImporter from './components/content/QuoteImporter.vue'
import DatabaseBackup from './components/content/DatabaseBackup.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: FileImporter },
  { path: '/fileimporter', component: FileImporter },
  { path: '/quoteimporter', component: QuoteImporter },
  { path: '/databasebackup', component: DatabaseBackup },
  { path: '/bar', component: FileImporter }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export { router }
