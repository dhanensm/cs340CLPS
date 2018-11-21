function searchTransactionsByCame() {
    //get the cname
    var cname_search_string  = document.getElementById('cname_search_string').value
    //construct the URL and redirect to it
    window.location = '/transactions/search_transactions/' + encodeURI(cname_search_string)
}
