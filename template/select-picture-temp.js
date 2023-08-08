export default `
<full-dialog
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnText="nextBtnText"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div
        :class="{'loading': loading}"
    >
        <div>照片存放區</div>
        <div
            class="grid-option"
        >
            <div>
                <i class="fa fa-picture-o" aria-hidden="true"></i>
            </div>
            <div>
                <input 
                    type="range"
                    v-model="pictGridNumber"
                    min="1"
                    max="6"
                    step="1"
                />
            </div>
            <div>
                <i class="fa fa-picture-o" aria-hidden="true"></i>
            </div>
        </div>
        <div
            class="type-option"
        >
            <div
                :class="{'active': index == currentType}"
                v-for="(type, index) in typeArr"
                :key="index"
                @click="typeChange(index)"
            >{{type}}</div>
        </div>
        <div
            class="picture-content"
            :class="gridStyle"
        >
            <div
                v-for="pict in currentPictList"
                :key="pict.uid"
                class="one-picture"
                :class="{'selected': checkShow(pict.uid)}"
                @click="onClick(pict.uid)"
            >
                <div
                    class="check-btn"
                    :class="{'selected': checkShow(pict.uid)}"
                >
                    <span 
                        v-if="muiltSelect && currentSelect.includes(pict.uid)"
                    >{{currentSelect.indexOf(pict.uid) + 1}}</span>
                    <i 
                        v-else-if="checkShow(pict.uid)"
                        class="fa fa-check"
                    ></i>
                </div>
                <img
                    :src="imgSrc(pict.src)"
                >
                <div
                    class="tick-icon"
                    v-if="pict.isUsed"
                >
                    <i class="fa fa-thumb-tack" aria-hidden="true"></i>
                </div>
            </div>
            <div
                v-if="!currentPictList.length"
                class="empty-remind"
            >無可選照片</div>
        </div>
    </div>
</full-dialog>
`