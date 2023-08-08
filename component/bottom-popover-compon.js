var template = /*html*/ `
<transition
    apper
    @after-leave="afterLeave"
>
<div
    id="bottom-popover-bg"
    :class="[bgClass]"
    @click.stop="bgClick"
    v-if="modelShow"
>
    <transition
        name="main"
    >
        <div
            class="bottom-popover-area"
            :class="contentClass"
            v-show="contentShow"
        >
            <slot
                name="main"
            >
                <div
                    :class="[popoverClass, {'active': optionsShow}]"
                    @click.stop="popClick"
                >+</div>
            </slot>
            <template
                v-show="optionsShow"
            >
                <div
                    v-for="(option, index) in options"
                    :class="[option?.class ?? '', {'active': optionsShow}]"
                    :style="[option?.style ?? '']"
                    :key="index"
                    @click.stop="optionClick(index)"
                ></div>
            </template>
        </div>
    </transition>
</div>
</transition>
`

export default {
    name: 'bottom-popover-compon',
    template,
    data() {
        return {
            modelShow: true,
            contentShow: true,
            optionsShow: false,
            allowBgClick: true,
            contentClassArr: [],
            onPopbgClass: 'gray-bg',
            popoverClass: 'plus-icon',
            onPopClass: 'active',
            options: [
                {
                    class: '',
                    style: '',
                    fnCall: () => { },
                }
            ],
        };
    },
    computed: {
        bgClass() {
            return {
                [this.onPopbgClass]: this.optionsShow,
            }
        },
        contentClass() {
            return this.contentClassArr.join(' ');
        }
    },
    methods: {
        show() {
            this.contentShow = true;
        },
        hide() {
            this.contentShow = false;
        },
        addClass(area, classStr) {
            let target;
            switch (area) {
                case 'content':
                    target = this.contentClassArr;
                    break;
                default:
                    break;
            }

            target.push(classStr);
        },
        removeClass(area, classStr) {
            let target;
            switch (area) {
                case 'content':
                    target = this.contentClassArr;
                    break;
                default:
                    break;
            }
            
            let index = target.findIndex(str => str == classStr);
            if(index != -1) target.splice(index, 1);
        },
        modelClose() {
            this.modelShow = false;
        },
        popClick() {
            this.optionsShow = !this.optionsShow;
        },
        optionClick(index) {
            // console.log(this.options[index]);
            this.options[index].fnCall?.();
            this.optionsShow = false;
        },
        bgClick() {
            if (this.allowBgClick && this.optionsShow) this.optionsShow = false;
        },
        async afterLeave() {
            await this.$nextTick();
            this.$destroy();
        }
    },
}