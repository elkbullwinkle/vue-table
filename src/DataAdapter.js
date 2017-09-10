import axios from 'axios';

let allowedRequestTypes = [
    'get',
    'post',
    'put',
    'delete',
    'head',
    'options',
    'patch',
]

class adapter {
    constructor (url, attributes, config) {

        console.log('Initializing data adapter')

        this.config = config
        this.attributes = attributes
        this.filters = {}
        this.sort = {}

        this.$io = axios.create({
            baseURL: url,
            headers: getHeaders(config),
        })

        return this
    }

    setAttributes(attributes) {
        this.attributes = attributes

        return this
    }

    setFilters(filters) {
        this.filters = filters

        return this
    }

    setSort(column, direction) {

        if (!! column) {
            this.sort = {
                column,
                direction
            }
        } else {
            this.sort = {}
        }
        return this
    }

    fetchData(page, filters) {

        if (filters) {
            this.setFilters(filters)
        }

        let requestConfig = prepareRequest(this, page)

        return new Promise((resolve, reject) => {
            this.$io.request(requestConfig)
                .then(response => {
                    resolve(prepareSuccessfulResponse(this, page, response.data))
                })
                .catch(error => {
                    reject(error)
                })
        })

    }
}

function prepareRequest(adapter, page) {

    let requestType = getRequestType(adapter.config)

    let paramsOrData = !['post', 'put', 'patch'].includes(getRequestType(adapter.config)) == 'get' ?
        'params' : adapter.config.queryAsDataOnPost ? 'data' : 'params';

    let query = Object.assign(adapter.attributes, adapter.filters)

    if (page) {
        query[adapter.config.pageAttribute] = page
    }

    if (adapter.sort.hasOwnProperty('column')) {
        query[adapter.config.sortAttribute] = adapter.sort.column
        query[adapter.config.sortDirectionAttribute] = adapter.sort.direction ? 'asc' : 'desc'
    }

    if (adapter.config.queryAsJson) {
        query = {
            [adapter.config.queryAttribute] : JSON.stringify(query)
        }
    }

    return {
        method : requestType,
        [paramsOrData] : query
    }
}

function prepareSuccessfulResponse(adapter, page, data) {

    let dataset = adapter.config.dataAttribute.trim() == '' ? data : data[adapter.config.dataAttribute]

    if (page) {
        return {
            dataset,
            pagination : {
                currentPage : data[adapter.config.currentPageAttribute],
                lastPage : data[adapter.config.lastPageAttribute]
            }
        }
    } else {
        return {
            dataset
        }
    }
}

function getRequestType(config) {
    if (allowedRequestTypes.includes(config.requestType)) {
        return config.requestType.toLowerCase()
    }

    return 'get'
}

function getHeaders(config) {

    let windowHeaders = {}

    if (config.mergeDefaultHeaders) {
        try {
            windowHeaders = window.axios.defaults.headers.common
        } catch(e) {}
    }

    return Object.assign(windowHeaders, config.headers)
}

export default adapter