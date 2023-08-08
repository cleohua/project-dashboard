var pictManaTemp = /*html*/ `
<div
    id="pict-mana-page"
    @click="areaClick"
    @wheel.stop.prevent="onPageWheel"
>
    <div
        class="pict-area"
    >
        <div>照片存放區</div>
        <div>
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
                    @click.stop="typeChange(index)"
                >{{type}}</div>
            </div>
            <div
                class="pict-select-option"
                v-show="selectCount"
            >
                <div
                    class="set-pict-type"
                    v-if="editable"
                >
                    <div
                        @click.stop="onSetTypeClick(0)"
                        :class="{'active': showTypeMenu && typeMenuNum == 0}"
                    >
                        <div></div>
                        <div>設定分類</div>
                    </div>
                    <div
                        v-show="showTypeMenu && typeMenuNum == 0"
                    >
                        <div 
                            v-for="type in setTypeMenu"
                            :key="type.type"
                            @click="setPictType(type.type)"
                        >設為{{type.text}}</div>
                    </div>
                </div>
                <div
                    class="set-pict-type"
                    v-if="editable"
                    v-show="currentType != 0"
                >
                    <div
                        @click.stop="onSetTypeClick(1)"
                        :class="{'active': showTypeMenu && typeMenuNum == 1}"
                    >
                        <div></div>
                        <div>新增分類</div>
                    </div>
                    <div
                        v-show="showTypeMenu && typeMenuNum == 1"
                    >
                        <div 
                            v-for="type in setTypeMenu"
                            :key="type.type"
                            @click="setPictType(type.type, true)"
                        >新增至{{type.text}}</div>
                    </div>
                </div>
                <div
                    class="download-pict-btn"
                    @click="downloadPict"
                >
                    <div></div>
                    <div>下載</div>
                </div>
            </div>
        </div>
        <div
            class="picture-content"
            :class="[{'on-drag-file': onDraging, 'match': dragLocation.pict}, gridStyle]"
            @dragenter.prevent="draglocatIn('pict')"
            @dragover.prevent="draglocatOver('pict')"
            @dragleave.prevent="draglocatOut($event, 'pict')"
            @drop="dropInPict"
        >
            <one-file
                v-for="file in currentPictList"
                :key="file.keyIndex"
                :file="file"
                :options="pictCustomOptions(file)"
                :reduce="onSelectReduce"
                :select-list="curSelectList"
                @select="onSelect"
                @reupload="onReupload($event, 'photo')"
            ></one-file>
            <div
                v-if="!currentPictList.length"
                class="empty-remind"
            >尚無新增照片</div>
        </div>
    </div>
    <div
        class="bg-area"
    >
        <div>底圖存放區</div>
        <div>
            <one-file
                v-for="bg in bgList"
                :key="bg.keyIndex"
                :file="bg"
                :options="bgCutomOptions(bg)"
                @delete="onDelete"
                @titlechange="onTitleChange"
            ></one-file> 
            <div
                class="new-bg-btn"
                v-if="editable"
                @click="newBgClick"
            >
                <div>+</div>
                <div>新增底圖</div>
                <input
                    ref="bgInput"
                    style="display:none;"
                    type="file"
                    accept="image/*"
                    @change="uploadPict($event.target.files, 'bg')"
                >
            </div>
        </div>
    </div>

    <input
        ref="fileInput"
        style="display:none;"
        type="file"
        accept="image/*"
        @change="uploadPict($event.target.files, 'pict')"
        multiple
    >
    <input 
        ref="cameraInput"
        style="display: none;"
        type="file"
        accept="image/*"
        capture="camera"
        @change="uploadPict($event.target.files, 'camera')"
    >
</div>`

var fileTemp = /*html*/ `
<div
    class="one-picture"
    :class="{'selected': isSelected}"
    @click.stop="onClick"
>
    <div
        class="check-btn"
        :class="{'selected': isSelected}"
        v-if="options.withSelect && file.status == 1"
        @click.stop="checkClick"
    >
        <span 
            v-if="isSelected"
        >{{selectNum}}</span>
    </div>
    <div
        class="delete-btn"
        :class=" {'lock': !options.deletable }"
        v-if="options.withDelete && file.status == 1"
        @click.stop="deleteClick"
    >
        <i 
            class="fa"
            :class="{'fa-trash': options.deletable, 'fa-lock': !options.deletable}"
        ></i>
    </div>
    <img
        :src="imgSrc"
        loading="lazy"
    >
    <div
        class="pict-title"
        :class="{'editable': options.editTitle}"
        v-if="options.withTitle"
        @click.stop
    >
        <input
            type="text"
            v-model="file.name"
            @change="titleChange"
            :readonly="!options.editTitle"
        >
    </div>
    <div
        class="tick-icon"
        v-if="options.withTick && file.status == 1"
    >
        <i class="fa fa-thumb-tack" aria-hidden="true"></i>
    </div>
    <div
        class="loading"
        v-if="file.status == 0"
    >
        <svg 
            class="radial-progress"
            viewBox="0 0 80 80"
        >
            <circle 
                class="incomplete"
                cx="40"
                cy="40"
                :r="R"
            ></circle>
            <circle 
                class="complete"
                cx="40"
                cy="40"
                r="35"
                :style="progressStyle"
            ></circle>
            <text 
                class="percentage" 
                x="50%" 
                y="57%"
                transform="matrix(0, 1, -1, 0, 80, 0)"
            >{{file.percent}}%</text>
        </svg>
    </div>
    <div
        class="loading"
        v-if="file.status == 2"
        @click="reUpClick"
    >
        <div
            class="repeat-icon"
        ></div>
    </div>
</div>`;

export {pictManaTemp, fileTemp}