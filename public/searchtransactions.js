function searchTransactionbyCname() {
    //get the first name 
    var cname_search_string  = document.getElementById('cname_search_string').value
    //construct the URL and redirect to it
    window.location = '/transactions/search/' + encodeURI(cname_search_string)
}
