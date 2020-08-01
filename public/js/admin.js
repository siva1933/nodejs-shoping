const deleteProduct = (btn) => {

  const prodId = btn.parentNode.querySelector("[name=id]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productEle = btn.closest('article');
  const url = '/admin/product/' + prodId;


  fetch(url, {
    method: "DELETE",
    headers: {
      'csrf-token': csrf
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    console.log(data)
    productEle.parentNode.removeChild(productEle)
  }).catch(err => {
    console.log(err)
  })
}