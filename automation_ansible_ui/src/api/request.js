import Qs from 'qs'
import axios from 'axios';
import {withRouter } from 'react-router-dom';

axios.interceptors.request.use(
	config => {
		config.headers.Authorization = `${window.localStorage.getItem('username')} ${window.localStorage.getItem('token')}`;
	    //config.headers['Content-Type'] = 'application/json'
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		return config;
	},
	err => {
		return Promise.reject(err);
	});
axios.interceptors.response.use(
	response => {
		if (window.location.pathname.split('/')[1] != 'login' && response.data.code == 401 || response.data.code == 405)  {
			window.localStorage.removeItem('username')
			window.localStorage.removeItem('token')
			window.location.href = '/login'
		}
		return response 
	},
	error => {
		let res = error.response;
		switch (res.status) {
			case 401:
				window.localStorage.removeItem('username')
				window.localStorage.removeItem('token')
				break 
			case 403:
				break
			case 500:
				break 
		}
		return Promise.reject(error.response.data) 
    });

let host = "http://127.0.0.1:8000"
let login_uri  = `${host}/v1/release/login`
let logout_uri = `${host}/v1/release/logout`
let index_uri  = `${host}/v1/assets/host`
let group_uri_s = `${host}/v1/assets/group`
let persion_uri = `${host}/v1/assets/persion`
let message_uri = `${host}/v1/assets/message`
let dashborad_host_uri = `${host}/v1/release/dashboard`
let login_log_uri = `${host}/v1/release/logs_login`
let operation_log_uri = `${host}/v1/release/logs_operation`
let task_submit_uri = `${host}/v1/release/submit`
let task_check_uri = `${host}/v1/release/check`
let task_list_uri = `${host}/v1/release/task_list`
let task_search_uri = `${host}/v1/release/task_search`
let task_detail_uri = `${host}/v1/release/task_detail`
let crontab_list_uri = `${host}/v1/release/crontab_list`
let crontab_opera_uri = `${host}/v1/release/crontab`
let crontab_add_uri = `${host}/v1/release/crontab_add`
let crontab_task_list_uri  = `${host}/v1/release/crontab_task_list`
let celery_add_uri = `${host}/v1/release/celery_add`
let celery_del_uri = `${host}/v1/release/celery_del`




export const handler_login = (body) => {
	return axios.post(`${login_uri}/`,Qs.stringify(body))
}

export const logout_v = (body) => {
	return axios.post(`${logout_uri}/`,Qs.stringify(body))
}

//主机增删改查
//----------------------------------------
export const index_v = (body) => {
	return axios.get(`${index_uri}/`,{params:Qs.stringify(body)})
}

export const search_host = (body) => {
	return axios.get(`${index_uri}/${body}/`)
}

export const host_create = (body) => {
	return axios.post(`${index_uri}/`,Qs.stringify(body))
}

export const host_change = (name,body) => {
	return axios.post(`${index_uri}/${name}/`,Qs.stringify(body))
}

export const delete_host = (body) => {
	return axios.delete(`${index_uri}/${body}/`)
}
//----------------------------------------------


// 主机群组增删改查
// ----------------------------------------------
export const get_group = (body) => {
	return axios.get(`${group_uri_s}/`,Qs.stringify(body))
}

export const search_group = (body) => {
	return axios.get(`${group_uri_s}/${body}/`)
}

export const create_group = (body) => {
	return axios.post(`${group_uri_s}/`,Qs.stringify(body))
}

export const del_group = (body) => {
	return axios.delete(`${group_uri_s}/${body}/`)
}

export const change_group = (name,body) => {
	return axios.post(`${group_uri_s}/${name}/`,Qs.stringify(body))
}
//----------------------------------------------

// 联系人增删改查

export const get_persion = (body) => {
	return axios.get(`${persion_uri}/`,Qs.stringify(body))
}

export const search_persion = (body) => {
	return axios.get(`${persion_uri}/${body}`,Qs.stringify(body))
}

export const create_persion = (body) => {
	return axios.post(`${persion_uri}/`,Qs.stringify(body))
}

export const del_persion = (body) => {
	return axios.delete(`${persion_uri}/${body}`)
}

export const change_persion = (name,body) => {
	return axios.post(`${persion_uri}/${name}/`,Qs.stringify(body))
}

export const message_get = (body) => {
	return axios.get(`${message_uri}/${body}/`,Qs.stringify(body))
}
export const message_update = (body) => {
	return axios.post(`${message_uri}/${body}/`,Qs.stringify(body))
}
//---------------------------------------------

//dashborad 

export const dashborad_host_count = (body) => {
	return axios.get(`${dashborad_host_uri}/`,Qs.stringify(body))
}

export const async_logins = (body) => {
	return axios.get(`${login_log_uri}/`,Qs.stringify(body))
}

export const async_operations = (body) => {
	return axios.get(`${operation_log_uri}/`,Qs.stringify(body))
}

export const async_logins_get = (body) => {
	return axios.post(`${login_log_uri}/`,Qs.stringify(body))
}

export const async_operations_get = (body) => {
	return axios.post(`${operation_log_uri}/`,Qs.stringify(body))
}

//release 
export const task_submit = (body) => {
	return axios.post(`${task_submit_uri}/`,Qs.stringify(body))
}

export const task_check = (body) => {
	return axios.get(`${task_check_uri}/`,Qs.stringify(body))
}

export const task_list = (body) => {
	return axios.get(`${task_list_uri}/`,Qs.stringify(body))
}

export const task_search = (body) => {
	return axios.get(`${task_search_uri}/${body}/`,Qs.stringify(body))
}

export const task_detail = (body) => {
	return axios.get(`${task_detail_uri}/${body}/`,Qs.stringify(body))
}

export const crontab_list = (body) => {
	return axios.get(`${crontab_list_uri}/`,Qs.stringify(body))
}

export const crontab_opera_put = (id,body) => {
	return axios.post(`${crontab_opera_uri}/${id}/`,Qs.stringify(body))
}

export const crontab_opera_del = (body) => {
	return axios.delete(`${crontab_opera_uri}/${body}/`,Qs.stringify(body))
}

export const crontab_opera_get = (body) => {
	return axios.get(`${crontab_opera_uri}/${body}/`,Qs.stringify(body))
}

export const crontab_add = (body) => {
	return axios.post(`${crontab_add_uri}/`,Qs.stringify(body))
}

export const crontab_task_list = (body) => {
	return axios.get(`${crontab_task_list_uri}/`,Qs.stringify(body))
}

export const celery_add = (body) => {
	return axios.post(`${celery_add_uri}/`,Qs.stringify(body))
}

export const celery_del = (body) => {
	return axios.delete(`${celery_del_uri}/${body}/`,Qs.stringify(body))
}