export default /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div 
        class="string-remind"
    >請問是否確定不指派?</div>
    <div 
        class="string"
    >*此缺失將由「{{text}}」負責</div>
</float-dialog>
`