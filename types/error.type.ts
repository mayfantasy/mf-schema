export class HttpError extends Error {
  constructor(message?: string, public status: number = 500) {
    super(message)

    const actualProto = new.target.prototype

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto)
    } else {
      ;(this as any).__proto__ = actualProto
    }
  }
}
