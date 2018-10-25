import React from 'react';
import {get_persion,del_persion,search_persion, create_persion,change_persion} from '../../api/request'
import Basemanager from '../assets/assets_base'

class Persion extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {   
        const option = {
            create: create_persion,
            remove: del_persion,
            update: change_persion,
            select: get_persion,
            search: search_persion,
            kwargsname: '负责人',
            mark: 'persion',
            update_modal: "修改负责人信息",
            create_modal: "创建负责人信息"
        }
        return (
            <div>
                <Basemanager {...option} />
            </div>
        )
    }
}

export default Persion
