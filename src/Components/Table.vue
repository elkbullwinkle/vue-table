<template>
    <div>
        <elk-preloader :display="isLoading"></elk-preloader>
        <table class="table is-fullwidth is-striped">
            <thead>
            <tr>
                <elk-table-th v-for="column in columns"
                              :column="column"
                              :active-sort-column="sortColumn"
                              :active-sort-direction="sortDirection"
                              @update:active-sort-column="val => sortColumn = val"
                              @update:active-sort-direction="val => sortDirection = val"
                              @sort="performSort"
                ></elk-table-th>
            </tr>
            </thead>
            <tbody>
                <elk-table-row v-for="item in dataset"
                               :columns="columns"
                               :item="item"
                               :row-click="rowClick"
                               @click-fired="clickFired">
                    <template v-for="column in columns"
                              :slot="column.title"
                              scope="props">
                        <slot :name="column.title"
                              :column="props.column"
                              :item="props.item"
                              :content="props.content">
                            <div v-html="props.content"></div>
                        </slot>
                    </template>
                </elk-table-row>
            <tr v-if="!dataPresent">
                <td :colspan="columns.length" class="text-center">
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
                        :page.number="pagination.currentPage"
                        :last-page.number="pagination.lastPage"
                        @pageSelected="paginate"
        ></elk-pagination>
    </div>
</template>

<script>

    import Pagination from './Pagination.vue'
    import Preloader from './Preloader.vue'
    import TableTh from './TableTh.vue'
    import TableRow from './TableRow.vue'

    import DataAdapter from './../DataAdapter.js'

    let defaultConfig = {

        mergeDefaultHeaders : true,

        headers : {
            'X-Requested-With' : 'XMLHttpRequest'
        },

        dataAttribute : 'data',
        pageAttribute : 'page',
        sortAttribute : 'order_by',
        sortDirectionAttribute : 'order_direction',
        currentPageAttribute : 'current_page',
        lastPageAttribute : 'last_page',
        queryAsJson : false,
        queryAsDataOnPost : false,
        queryAttribute : 'query',
        requestType : 'get'

    }

    let adapterConfigAttributes = [
        'mergeDefaultHeaders',
        'headers',
        'dataAttribute',
        'pageAttribute',
        'sortAttribute',
        'sortDirectionAttribute',
        'currentPageAttribute',
        'lastPageAttribute',
        'queryAsJson',
        'queryAttribute',
        'requestType',
    ]

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

            columns : {
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
                default: () => { return {}},
            },

            filters : {
                type : Object,
                default: () => {return {}},
            },

            'row-click' : {
                type : Boolean,
                default : false,
            },

            config : {
                type : Object,
                default : () => { return {}}
            }
        },

        data() {
            return {
                dataset : {},
                pagination : {
                    currentPage : 1,
                    lastPage : 1,
                },

                adapter : null,

                manageData : false,

                sortColumn : '',
                sortDirection : true,

                isLoading : false,
            }
        },

        computed : {

            displayPagination() {
                return this.manageData && this.dataset.length > 0 && this.pagination.lastPage > 1
            },

            shouldPaginate() {
                return this.manageData && this.paginated
            },

            dataPresent() {
                return this.dataset.length && !this.isLoading
            },

            hasSortableColumns() {
                return this.columns.some(column => typeof column.sortable === 'string')
            },

            sortableColumns() {
                return this.columns.filter(column => typeof column.sortable === 'string')
            },

            remoteSource() {
                return this.url !== null ? this.url : false
            },

            getConfig() {
                return Object.assign(defaultConfig, this.config)
            },

            getAdapterConfig() {

                const config = this.getConfig

                return Object.keys(config)
                    .filter(key => adapterConfigAttributes.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = config[key]
                        return obj
                    }, {})
            },

        },

        created() {

            let url = this.remoteSource

            if (url)
            {
                this.initSort()
                    .initDataAdapter()
                    .fetchData(this.shouldPaginate ? 1 : false)

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

            initDataAdapter() {
                this.manageData = true

                this.pagination.currentPage = this.shouldPaginate ? 1 : true

                this.adapter = new DataAdapter(
                    this.remoteSource,
                    this.attributes,
                    this.getAdapterConfig
                ).setSort(this.sortColumn, this.sortDirection)

                return this
            },

            paginate(page = 1) {
                console.log('Going to page ' + page)

                this.pagination.currentPage = page

                this.fetchData()
            },

            clickFired(...args) {

                this.$emit('click-fired', ...args)

            },

            performSort(column, direction) {
                this.adapter
                    .setSort(column, direction)

                this.fetchData()
            },

            fetchData() {

                let page = this.shouldPaginate ? this.pagination.currentPage : false

                console.log('Fetching data')

                this.isLoading = true;

                this.adapter
                    .setAttributes(this.attributes)
                    .setFilters(this.filters)
                    .fetchData(page)
                    .then(({dataset, pagination}) => {
                        this.isLoading = false
                        this.dataset = dataset

                        if (page) {
                            this.pagination = pagination
                        }
                    })
                    .catch(error => {
                        alert('Something went wrong')
                        console.log(error)
                        this.isLoading = false
                    })


            },

        },

        watch : {
            data() {

                if (!this.manageData)
                {
                    this.dataSet.data = this.data
                }

            },

            filters : {
                handler : function (val) {
                    if (this.manageData) {
                        this.pagination.currentPage = 1
                        this.fetchData()
                    }
                },

                deep : true,
            }
        },

        mounted() {
            console.log('Mounted')

            if (this.data.length)
            {
                this.dataSet.data = this.data
                console.log('Created from local data')
            }
        }
    }
</script>