var template = /*html*/ `
<float-dialog
    :type="type"
    :showReturnBtn="showReturnBtn"
    :returnBtnText="returnBtnText"
    :showNextBtn="showNextBtn"
    :nextBtnText="nextBtnText"
    :elementID="elementID"
    :titleText="titleText"
    @closeClick="closeClick"
    @nextBtnClick="nextBtnClick"
    @afterLeave="afterLeave"
    ref="dialog"
>
    <div
        :class="{'loading': loading}"
    >
        <div
            ref="canvasArea"
        >
            <canvas 
                id="canvas"
            ></canvas>
        </div>
        <div>
            <control-panel
                v-for="(item, i) in panelArray"
                :key="i"
                :level="i"
                :menu="item.menu"
                :current="item.current"
                :type="item.type"
                @handle-tools="handleTools"
                @pick-color="onPickColor"
                @value-change="valueChange"
            ></control-panel>
        </div>
    </div>
</float-dialog>
`

var controlPanelTemp = /*html*/ `
<div>
    <div
        class="control-panel"
        :class="levelClass"
        :data-type="type"
    >
        <template
            v-if="type == 'default' || type =='big'"
        >
            <div
                v-for="(tool, index) in menu"
                :key="tool.name"
                :type="tool.name"
                :class="{'active': isActive(index, current, tool.name), 'big-icon': type == 'big'}"
                @click="handleTools(tool.name, index)"
                v-html="tool.svg"
            ></div>
        </template>
        <template
            v-if="type == 'color'"
        >
            <div
                v-for="(color, index) in menu"
                :key="color"
                @click="pickColor(index)"
            >
                <div
                    :style="{'background-color': color}"
                ></div>
                <div
                    v-if="index == current"
                    :style="{'border-color': color}"
                ></div>
            </div>
        </template>
        <template
            v-if="type == 'range'"
        >
            <div
                v-for="tool in menu"
                :key="tool.name"
            >
                <div>{{tool.text}}</div>
                <div>
                    <input
                        type="range"
                        :value="tool.value"
                        @input="inputChange($event, tool)"
                        :min="tool.min"
                        :max="tool.max"
                        :step="tool.step"
                        :style="rangeStyle(tool)"
                    >
                </div>
            </div>
        </template>
    </div>
</div>
`

export { template, controlPanelTemp };