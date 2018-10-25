

export const group_column = [{
    title: 'id',
    dataIndex: 'id',
    width: '10%',
}, {
    title: '群组名称',
    dataIndex: 'groupname',
    width: "15%",
    render: (text) => {
        return (
        <a href="#">{text}</a>
    )
}
},{
    title: '操作',
    dataIndex: 'operation',
    width: "15%",
    render: (text) => {
        return (
            (<div>
                <a href="javascript:;" onClick={() => this.group_edit(text)}>修改</a>&nbsp;|&nbsp;
                <Popconfirm title="确定删除该主机？" okText="Yes" onConfirm={() => this.group_remove(text)} cancelText="No">
                    <a href="javascript:;" >删除</a>&nbsp;&nbsp;
                </Popconfirm>
            </div>
            )
        );
    },
}]

