export default /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div>
        <div>
            <div>責任工程師</div>
            <div
                v-for="item in checkerData.engineer"
                :key="item.uid"
            >
                <i class="fa fa-circle" aria-hidden="true"></i>
                <div>{{item.text}}</div>
            </div>
        </div>
        <div>
            <div>缺失改善人員</div>
            <div>
                <i class="fa fa-circle" aria-hidden="true"></i>
                <div>{{checkerText}}</div>
            </div>
        </div>
    </div>
    <div>*以上人員將負責此缺失</div>
</float-dialog>
`