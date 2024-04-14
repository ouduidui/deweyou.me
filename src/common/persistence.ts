import Crypto from 'crypto-es'

export class Persistence<T extends Record<string, any>> {
  constructor(private key: string, private defaultValue: T) {
    if (this.getValue() === this.defaultValue)
      this.setValue(defaultValue)
  }

  setValue(newVal: T) {
    try {
      const valStr = JSON.stringify(newVal)
      window.localStorage.setItem(this.key, this.encrypt(valStr))
      return true
    }
    catch (e) {
      return false
    }
  }

  getValue(): T {
    try {
      const val = window.localStorage.getItem(this.key)
      if (val)
        return JSON.parse(this.decrypt(val))
      else
        return this.defaultValue
    }

    catch (e) {
      return this.defaultValue
    }
  }

  encrypt(str: string) {
    return Crypto.AES.encrypt(str, this.key).toString()
  }

  decrypt(str: string) {
    return Crypto.AES.decrypt(str, this.key).toString(Crypto.enc.Utf8)
  }
}
