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
        :class="{'loading': loading}"
    >
        <div>
            <div>
                <div>責任工程師</div>
                <div
                    class="mouse-pointer"
                    @click="addEngineer"
                >
                    <div>{{engineerNameText}}</div>
                    <div
                        class="triangle-icon"
                    ></div>
                </div>
            </div>
        </div>
        <div>
            <div>
                <div>缺失改善人員</div>
                <div
                    class="mouse-pointer"
                    @click="addChecker"
                >
                    <div>{{checkerNameText}}</div>
                    <div
                        class="triangle-icon"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</float-dialog>
`