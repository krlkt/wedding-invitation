export const naturalSort = (a: string, b: string) => {
    const re = /(\d+)|(\D+)/g;
    const aParts = a.match(re) || [];
    const bParts = b.match(re) || [];

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        const aPart = aParts[i];
        const bPart = bParts[i];

        if (isNaN(parseInt(aPart)) || isNaN(parseInt(bPart))) {
            if (aPart < bPart) return -1;
            if (aPart > bPart) return 1;
        } else {
            const aNum = parseInt(aPart);
            const bNum = parseInt(bPart);
            if (aNum < bNum) return -1;
            if (aNum > bNum) return 1;
        }
    }

    return aParts.length - bParts.length;
};