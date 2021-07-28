import { createSelector } from 'reselect'
import moment from 'moment'
import OrderStatuses from '../../../../node-back/src/constants/OrderStatuses'
import {isAvailableOrder} from '../../utils/helpers';

const getOrders = state => state.app.orders;
const getUser = state => state.auth.user; // Available
const getAvailables = createSelector(
    [getOrders, getUser],
    (orders, user) => {
        let availables = orders.filter(order => isAvailableOrder(order, user))
        return {
            list: availables,
            count: availables.reduce((sum ,order) => (sum+order.packages.length), 0)
        };
    }
)

const getOrdersGroupedByDate = createSelector(
    [getOrders],
    (orders) => {
        let days = {};
        let currentDay = moment().startOf('day');

        const getEmptyDay = (date, daysAgo) => {
            return {
                title: daysAgo==0 ? 'Today' : (daysAgo == 1 ? 'Yesterday' : date.format('MMM Do')),
                orders: [],
            }
        }

        orders.map(o => {
            let date = moment(o.time.create)
            let dayKey = date.startOf('day').format('YYYY-MM-DD')
            let daysAgo = currentDay.diff(date, "days")
            console.log({daysAgo, dayKey})
            if(days[dayKey] === undefined){
                days[dayKey] = getEmptyDay(date, daysAgo)
            }
            days[dayKey].orders.push(o);
        })
        let sortedKeys = Object.keys(days).sort((a, b) => (a < b))
        return {
            days: sortedKeys.map(key => days[key])
        }
    }
)

const getFeedbackList = createSelector(
    [getOrders, getUser],
    (orders, authUser) => {
        return orders.filter(o => {
            if(o.status !== OrderStatuses.Delivered)
                return false
            if (o.payer === 'receiver' && authUser?._id === o.receiver._id) {
                return !o.receiverFeedback;
            }
            else if (o.payer === 'sender' && authUser?._id === o.sender._id) {
                return !o.senderFeedback;
            }
        })
    }
)

export {
    getAvailables,
    getOrdersGroupedByDate,
    getFeedbackList,
}
