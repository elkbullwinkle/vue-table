import Table from './Components/Table.vue';
import Pagination from './Components/Pagination.vue';

module.exports = {
    install: function (Vue, options) {
        Vue.component('vue-table', Table);
        Vue.component('vue-pagination', Pagination);
    }
};