import Cookies from 'js-cookie'

export function useCookie(key, options = {}) {
  const cookie = ref(Cookies.get(key))
  
  watch(cookie, (newVal) => {
    if (newVal === null || newVal === undefined) {
      Cookies.remove(key)
    } else {
      Cookies.set(key, newVal, options)
    }
  })
  
  return cookie
}