import React from 'react';
import {get_group,del_group,search_group, create_group,change_group} from '../../api/request'
import Basemanager from '../assets/assets_base'

class Zesher extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {   
        const option = {
            create: create_group,
            remove: del_group,
            update: change_group,
            select: get_group,
            search: search_group,
            kwargsname: '主机群组',
            mark: 'group',
            update_modal: "修改群组信息",
            create_modal: "创建群组信息"
        }
        return (
            <div>
                < Basemanager {...option} />
            </div>
        )
    }
}


export default Zesher
