<template>
    <nav aria-label="Pages" class="pagination is-centered">
        <a class="pagination-previous" :class="{'is-disabled' : activePage == 1}" @click="selectPage(activePage - 1)" :disabled="activePage == 1">Previous</a>
        <a class="pagination-next" :class="{'is-disabled' : activePage == lastPage}" @click="selectPage(activePage + 1)" :disabled="activePage == lastPage">Next page</a>
        <ul class="pagination-list">
            <li v-for="page_ in pages">
                <a class="pagination-link"
                   v-if="page_.type == 'page'"
                   :class="{'is-current' : activePage == page_.number}"
                   @click="selectPage(page_.number)">{{ page_.number }}</a>
                <span v-if="page_.type == 'dots'"
                      class="pagination-ellipsis">&hellip;</span>
            </li>
        </ul>
    </nav>
</template>

<script>

    export default {

        props : {
            page : {
                default : 1,
            },

            lastPage : {
                required : true,
                type : Number,
            }
        },

        data() {
            return {
                activePage : 1,
                pages : []
            }
        },

        methods: {
            selectPage(page) {

                this.activePage = page
                this.$emit('pageSelected', page)
                this.render(page)

            },

            render(page) {

                let pages = []
                let separators = []

                if (this.lastPage > 10 && this.activePage > 0)
                {
                    if (this.activePage < 7)
                    {
                        separators.push({
                            page : 8,
                            nextPage : this.lastPage - 2,
                        })
                    }
                    else if(this.activePage > (this.lastPage - 7))
                    {
                        separators.push({
                            page : 3,
                            nextPage : this.lastPage - 8,
                        })
                    }
                    else
                    {
                        separators.push({
                            page : 3,
                            nextPage : this.activePage - 4,
                        })
                        separators.push({
                            page : this.activePage + 4,
                            nextPage : this.lastPage - 2,
                        })
                    }
                }

                for(let i = 1; i <= this.lastPage; i++)
                {
                    let shouldContinue = false

                    separators.forEach(separator => {
                        if (separator.page == i)
                        {
                            shouldContinue = true
                            i = separator.nextPage
                        }
                    })

                    if (shouldContinue)
                    {
                        pages.push({
                            type : 'dots'
                        })

                        continue
                    }

                    pages.push({
                        number : i,
                        type : 'page'
                    })
                }

                this.pages = pages
            },
        },

        watch : {
            page(newPage) {
                this.activePage = newPage
            }
        },

        mounted() {
            console.log('Paginator mounted.')

            this.render(1)
        }
    }
</script>