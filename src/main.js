import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Swipe, SwipeItem, SwipeCell, Lazyload, Badge, Sidebar,
    SidebarItem, Collapse, CollapseItem, Tab, Tabs,
    Card, Image as VanImage, Button, Tag, Form, Field,  Cell, CellGroup,
    Stepper, SubmitBar, Checkbox, CheckboxGroup, AddressEdit, AddressList,
    Icon, Popup, Grid, GridItem} from "vant";

createApp(App).use(store).use(router)
    .use(Swipe).use(SwipeItem).use(Lazyload, {
        loading: require('./assets/images/default.png')
    }).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
    .use(Tab).use(Tabs ).use(Card).use(VanImage).use(Button).use(Tag).use(Form).use(Cell)
    .use(CellGroup).use(Field).use(Stepper).use(SubmitBar).use(Checkbox).use(CheckboxGroup)
    .use(SwipeCell).use(AddressEdit).use(AddressList).use(Icon).use(Popup).use(Grid).use(GridItem)
    .mount('#app')
