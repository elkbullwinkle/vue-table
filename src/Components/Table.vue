<template>
    <div>
        <elk-preloader :display="isLoading"></elk-preloader>
        <table class="table is-fullwidth is-striped">
            <thead>
            <tr>
                <th v-for="field in fields" v-html="field.title"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in dataSet.data" style="cursor: pointer">
                <td v-for="field in fields" v-html="getField(item, field.field)" @click="clickFired(item, field)">
                </td>
            </tr>
            <tr v-if="!dataSet.data.length && !isLoading">
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


    export default {

        components: {
            'elk-pagination' : Pagination,
            'elk-preloader' : Preloader,
        },

        props : {
            name : {
                required : true,
            },

            fields : {
                required : true,
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

            'on-row-click' : {
                default : null,
            }
        },

        data() {
            return {
                dataSet : {
                    data : [],
                },

                manageData : false,

                isLoading : false,
            }
        },

        computed : {

            displayPagination() {
                return this.manageData && this.dataSet.total > 0 && this.dataSet.last_page > 1
            }

        },

        created() {

            if (this.url !== null)
            {
                this.manageData = true

                this.$io = axios.create({
                    baseURL: this.url,
                    headers: {
                        'X-Requested-With' : 'XMLHttpRequest'
                    },
                    params : this.attributes,
                })

                this.fetchData()
            }

        },

        methods : {
            getField(item, field) {

                if (typeof field === "function")
                {
                    return field(item)
                }

                if (Array.isArray(field))
                {
                    const output = []
                    field.forEach(arg =>
                    {
                        output.push(eval("item." + arg))
                    })

                    return output.join(' ')
                }

                return eval("item." + field)
            },

            paginate(page = 1) {
                console.log('Going to page ' + page)

                this.fetchData('', page)
            },

            render(dataSet) {

                if (this.paginated)
                {
                    this.dataSet = dataSet
                }
                else
                {
                    console.log('wrong')
                    this.dataSet.data = dataSet
                }

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

                        this.render(response.data)

                        this.isLoading = false
                    })
                    .catch((response) => {
                        console.warn('Error fetching data')
                        this.isLoading = false
                    })
            },

            clickFired(item, field) {

                if (field.disableClick)
                {
                    return false;
                }

                if (typeof field.onClick === "function")
                {
                    field.onClick(item, field);
                    return;
                }

                if (typeof this.onRowClick === "function")
                {
                    this.$emit('row-clicked', item, field)

                    this.onRowClick(item, field);
                    return;
                }

                console.log('No click events defined', item);
            },

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