<template>
    <div>
        <elk-preloader :display="isLoading"></elk-preloader>
        <table class="table is-fullwidth is-striped">
            <thead>
            <tr>
                <elk-table-th v-for="field in fields"
                              :field="field"
                              :active-sort-column="sortColumn"
                              :active-sort-direction="sortDirection"
                              @update:active-sort-column="val => sortColumn = val"
                              @update:active-sort-direction="val => sortDirection = val"
                              @sort="performSort"
                ></elk-table-th>
            </tr>
            </thead>
            <tbody>
                <elk-table-row v-for="item in getDataset"
                               :fields="fields"
                               :item="item"
                               :row-click="rowClick"
                               @click-fired="clickFired">
                    <template v-for="field in fields"
                              :slot="field.title"
                              scope="props">
                        <slot :name="field.title"
                              :field="props.field"
                              :item="props.item"
                              :content="props.content">
                            <div v-html="props.content"></div>
                        </slot>
                    </template>
                </elk-table-row>
            <tr v-if="!dataPresent">
                <td :colspan="fields.length" class="text-center">
                    <slot name="placeholder">
                        <h4>
                            No items found
                        </h4>
                    </slot>
                </td>
            </tr>
            </tbody>
        </table>
        <elk-pagination v-if="displayPagination"
                        :page.number="dataSet.current_page"
                        :last-page.number="dataSet.last_page"
                        @pageSelected="paginate"
        ></elk-pagination>
    </div>
</template>

<script>

    import axios from 'axios';
    import Pagination from './Pagination.vue'
    import Preloader from './Preloader.vue'
    import TableTh from './TableTh.vue'
    import TableRow from './TableRow.vue'

    let defaultConfig = {

        mergeDefaultHeaders : true,

        headers : {
            'X-Requested-With' : 'XMLHttpRequest'
        },

        dataAttribute : 'data',
        sortAttribute : 'orderBy',
        sortDirectionAttribute : 'orderDirection'

    }


    export default {

        components: {
            'elk-pagination' : Pagination,
            'elk-preloader' : Preloader,
            'elk-table-th' : TableTh,
            'elk-table-row' : TableRow,
        },

        props : {
            name : {
                required : true,
                type : String,
            },

            fields : {
                required : true,
                type : Array,
            },

            'active-sort-column' : {
                type : String,
                default : '',
            },

            data : {
                default : () => [],
                type : Array,
            },

            paginated : {
                default : false,
            },

            'display-preloader' : {
                default : true,
            },

            url : {
                default : null,
            },

            attributes : {
                type : Object,
                default: () => {},
            },

            filters : {
                type : Object,
                default: () => {},
            },

            'watch-attributes' : {
                type : Boolean,
                default : true,
            },

            'row-click' : {
                type : Boolean,
                default : false,
            },

            config : {
                type : Object,
                default : () => {{}}
            }
        },

        data() {
            return {
                dataset : {},

                manageData : false,

                sortColumn : '',
                sortDirection : true,

                isLoading : false,
            }
        },

        computed : {

            displayPagination() {
                return this.manageData && this.dataSet.total > 0 && this.dataSet.last_page > 1
            },

            dataPresent() {
                return this.dataSet.data.length && !this.isLoading
            },

            hasSortableColumns() {
                return this.fields.some(field => typeof field.sortable === 'string')
            },

            sortableColumns() {
                return this.fields.filter(field => typeof field.sortable === 'string')
            },

            remoteSource() {
                return this.url !== null ? this.url : false
            },

            getConfig() {
                return Object.assign(defaultConfig, this.config)
            },

            getHeaders() {

                let windowHeaders = {}

                if (this.getConfig.mergeDefaultHeaders) {
                    try {
                        windowHeaders = window.axios.defaults.headers.common
                    } catch(e) {}
                }

                return Object.assign(windowHeaders, this.getConfig)
            },

        },

        created() {

            let url = this.remoteSource

            if (url)
            {
                this.initSort()
                    .initAxios()
                    .fetchData()

            }

        },

        methods : {

            initSort() {
                if (this.hasSortableColumns) {
                    let activeColumn = this.sortableColumns.find(column => column.sortable == this.activeSortColumn)

                    if (typeof activeColumn === 'undefined')
                    {
                        activeColumn = this.sortableColumns[0]
                    }

                    this.sortColumn = activeColumn.sortable
                }

                return this
            },

            initAxios() {
                this.manageData = true

                this.$io = axios.create({
                    baseURL: this.url,
                    headers: this.getHeaders,
                    params : this.attributes,
                })

                return this
            },

            paginate(page = 1) {
                console.log('Going to page ' + page)

                this.fetchData('', page)
            },

            clickFired(...args) {

                this.$emit('click-fired', ...args)

            },

            performSort(column, direction) {

            },

            fetchData(url = '', page = 1) {

                this.isLoading = true;

                this.$io.get(url, {
                    params:
                        Object.assign({
                            page
                        }, this.filters)
                })
                    .then((response) => {

                        this.setDataset(response.data)

                        this.isLoading = false
                    })
                    .catch((response) => {
                        console.warn('Error fetching data')
                        this.isLoading = false
                    })
            },

            setDataset(data) {

                if (this.paginated) {
                    this.datset = this.getData(data)
                } else {
                    this.dataSet.data = dataSet
                }

            },

            getData(dataset) {
                let dataAttribute = this.getConfig.dataAttribute

                if (dataAttribute == '') {
                    return dataset
                }
                else {
                    return dataset[dataAttribute]
                }
            }

        },

        watch : {
            data() {

                if (!this.manageData)
                {
                    this.dataSet.data = this.data
                }

            },

            filters() {

                console.log('Watching filters')

                if (this.watchAttributes)
                {
                    console.log('Attributes changed')

                    this.fetchData('', 1)
                }
            }
        },

        mounted() {
            if (this.data.length)
            {
                this.dataSet.data = this.data
                console.log('Created from local data')
            }
        }
    }
</script>