import { CanMatchFn, Route, UrlSegment } from '@angular/router';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function uuidParamGuard(paramIndex = 0): CanMatchFn {
    return (_route: Route, segments: UrlSegment[]) => {
        const segment = segments[paramIndex];
        return !!segment && UUID_REGEX.test(segment.path);
    };
}
